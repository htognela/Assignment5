import Layout from "../components/layout";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AmericanCustomers = ({ data }) => {
    const ref = useRef();

    useEffect(() => {
        if (data.length > 0) {
            const svg = d3.select(ref.current);
            svg.selectAll("*").remove();

            const width = 800;
            const height = 400;
            const margin = { top: 20, right: 30, bottom: 40, left: 90 };

            svg.attr("width", width).attr("height", height);

            const x = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.count)])
                .range([margin.left, width - margin.right]);

            const y = d3.scaleBand()
                .domain(data.map(d => d.city))
                .range([margin.top, height - margin.bottom])
                .padding(0.1);

            svg.append("g")
                .attr("fill", "steelblue")
                .selectAll("rect")
                .data(data)
                .join("rect")
                .attr("x", x(0))
                .attr("y", d => y(d.city))
                .attr("width", d => x(d.count) - x(0))
                .attr("height", y.bandwidth());

            svg.append("g")
                .attr("transform", `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(y))
                .attr("font-size", '12px');

            svg.append("g")
                .attr("transform", `translate(0, ${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .attr("font-size", '12px');
        }
    }, [data]);

    return (
        <Layout>
            <svg ref={ref}></svg>
        </Layout>
    );
}

export async function getServerSideProps() {
    const response = await fetch('http://localhost:8000/american-customers-by-city/');
    const data = await response.json();

    return { props: { data } };
}

export default AmericanCustomers;
