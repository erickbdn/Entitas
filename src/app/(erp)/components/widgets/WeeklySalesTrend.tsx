"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { DashboardWidget } from "../subcomponents/DashboardWidget";
import { useSalesDataContext } from "../../context/SalesDataContext";

export function WeeklySalesTrend() {
  const { salesData, loading } = useSalesDataContext();
  const weeklySales = useMemo(() => salesData?.weeklySalesTrend || [], [salesData]);

  const chartRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 250, height: 100 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: width > 0 ? width : 250,
          height: height > 0 ? height : 100,
        });
      }
    });

    const currentContainer = containerRef.current;
    if (currentContainer) resizeObserver.observe(currentContainer);

    return () => {
      if (currentContainer) resizeObserver.unobserve(currentContainer);
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || weeklySales.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const margin = { top: 80, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(weeklySales.map(d => d.day))
      .range([0, chartWidth])
      .padding(0.2);

      const maxSales = d3.max(weeklySales, d => d.value) || 0;

      const y = d3.scaleLinear()
        .domain([0, maxSales > 0 ? maxSales : 1]) // Avoid a scale of [0, 0]
        .nice()
        .range([chartHeight, 0]);
      

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Bars
    g.selectAll("rect")
    .data(weeklySales)
    .enter().append("rect")
    .attr("x", d => x(d.day)!)
    .attr("y", d => Math.min(y(d.value), chartHeight)) // Prevent negative Y values
    .attr("width", x.bandwidth())
    .attr("height", d => Math.max(chartHeight - y(d.value), 0)) // Ensure height is never negative
    .attr("rx", 8)
    .attr("fill", "#2E4052");  

    // Labels (values)
    g.selectAll("text.value")
      .data(weeklySales)
      .enter().append("text")
      .attr("x", d => x(d.day)! + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 6)
      .attr("text-anchor", "middle")
      .attr("fill", "#E9E1D8")
      .attr("font-size", "14px")
      .text(d => d.value);

    // Labels (days)
    g.selectAll("text.day")
      .data(weeklySales)
      .enter().append("text")
      .attr("x", d => x(d.day)! + x.bandwidth() / 2)
      .attr("y", chartHeight + 16)
      .attr("text-anchor", "middle")
      .attr("fill", "#E9E1D8")
      .attr("font-size", "14px")
      .text(d => d.day);
  }, [dimensions, weeklySales]);

  return (
    <DashboardWidget
      title="Weekly Sales Trend"
      className="col-span-3 rounded-2xl"
      titleClassName="z-10 absolute top-4 left-4 text-secondary-lighter"
      contentClassName="p-0"
    >
      <div ref={containerRef} className="w-full h-40 md:h-52 lg:h-60">
        {loading ? <p className="text-center text-gray-400">Loading...</p> : <svg ref={chartRef} className="w-full h-full" />}
      </div>
    </DashboardWidget>
  );
}
