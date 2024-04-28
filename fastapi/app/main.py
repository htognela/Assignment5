from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from .database import SessionLocal
from pydantic import BaseModel, Field
import datetime
from sqlalchemy.orm import sessionmaker
from fastapi.responses import JSONResponse
from typing import List
from sqlalchemy.exc import SQLAlchemyError

DATABASE_URL = "mysql+mysqlconnector://root:supersecretpassw0rd@mysql/sakila"


app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
async def root():
    return {"message": "Howdy"}

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Customer(BaseModel):
    first_name: str
    last_name: str
    email: str
    address_id: int

class RentalRequest(BaseModel):
    customer_id: int
    inventory_ids: list

@app.get("/getCanadianCustomers")
def getCanadianCustomers():
    session = SessionLocal()
    try:
        result = session.execute(text("""
            SELECT customer.first_name, customer.last_name, customer.email, city.city
            FROM customer
            JOIN address ON customer.address_id = address.address_id
            JOIN city ON address.city_id = city.city_id
            JOIN country ON city.country_id = country.country_id
            WHERE country.country = 'Canada'
            ORDER BY city.city
        """))
        customers = [{"first_name": row[0], "last_name": row[1], "email": row[2], "city": row[3]} for row in result]
        return customers
    finally:
        session.close()

@app.get("/american-customers-by-city/")
def american_customers_by_city():
    session = SessionLocal()
    try:
        result = session.execute(text("""
            SELECT city.city, COUNT(customer.customer_id) AS customer_count
            FROM customer
            JOIN address ON customer.address_id = address.address_id
            JOIN city ON address.city_id = city.city_id
            JOIN country ON city.country_id = country.country_id
            WHERE country.country = 'United States'
            GROUP BY city.city
            ORDER BY customer_count DESC
        """))
        data = [{"city": row['city'], "count": row['customer_count']} for row in result.mappings()]
        return data
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})
    finally:
        session.close()

@app.post("/add-customer/")
def add_customer(customer: Customer):
    db = SessionLocal()
    try:
        stmt = text("""
            INSERT INTO customer (store_id, first_name, last_name, email, address_id, create_date, active)
            VALUES (:store_id, :first_name, :last_name, :email, :address_id, NOW(), 1)
        """)
        db.execute(stmt, {
            'store_id': 1,
            'first_name': customer.first_name,
            'last_name': customer.last_name,
            'email': customer.email,
            'address_id': customer.address_id
        })
        db.commit()
        return {"message": "Customer added successfully!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()

@app.post("/rent-videos/")
def rent_videos(request: RentalRequest, db: Session = Depends(get_db)):
    try:
        today = datetime.datetime.now()
        return_date = today + datetime.timedelta(days=5)

        for inventory_id in request.inventory_ids:
            inventory_available = db.execute(text("SELECT inventory_in_stock(:id)"), {'id': inventory_id}).scalar()
            if not inventory_available:
                raise HTTPException(status_code=400, detail=f"Inventory ID {inventory_id} is not available")

            rental_data = {
                'rental_date': today,
                'inventory_id': inventory_id,
                'customer_id': request.customer_id,
                'return_date': return_date,
                'staff_id': 1
            }
            db.execute(text("""
                INSERT INTO rental (rental_date, inventory_id, customer_id, return_date, staff_id)
                VALUES (:rental_date, :inventory_id, :customer_id, :return_date, :staff_id)
            """), rental_data)

            db.execute(text("UPDATE inventory SET last_update = NOW() WHERE inventory_id = :inventory_id"), {'inventory_id': inventory_id})

        db.commit()
        return {"message": "Rental successful", "return_date": return_date}

    except SQLAlchemyError as e:
        db.rollback()
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while processing the rental.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))




