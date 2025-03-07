"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { DashboardWidget } from "../subcomponents/DashboardWidget";
import { Package } from "lucide-react"; // Import inventory icon

const MAX_CAPACITY = 200;
const CURRENT_INVENTORY = 150;

export function InventoryLevels() {
  const pieChartRef = useRef<SVGSVGElement | null>(null);
  const inventoryPercentage = (CURRENT_INVENTORY / MAX_CAPACITY) * 100;

  useEffect(() => {
    if (!pieChartRef.current) return;

    const width = 150;
    const height = 150;
    const radius = Math.min(width, height) / 2;

    const data = [
      { label: "Used", value: CURRENT_INVENTORY },
      { label: "Remaining", value: MAX_CAPACITY - CURRENT_INVENTORY },
    ];

    const color = d3.scaleOrdinal(["#2E4052", "#2E405210"]); 

    const arc = d3
      .arc<d3.PieArcDatum<(typeof data)[0]>>()
      .innerRadius(50)
      .outerRadius(radius)
      .cornerRadius(8); // Add border radius

    const pie = d3.pie<(typeof data)[0]>().value((d) => d.value);

    const svg = d3
      .select(pieChartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    svg
      .selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc as string | ((d: d3.PieArcDatum<(typeof data)[0]>) => string | null) | null)
      .attr("fill", (_, i) => color(i.toString()) as string)
      .transition()
      .duration(2000)
      .ease(d3.easeExpOut) // Add easing function here
      .attrTween("d", function (d) {
      const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return function (t) {
      return arc(interpolate(t))!;
      };
      });

    // Add Percentage Text in Center
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "18px")
      .attr("fill", "#E9E1D8")
      .text(`${inventoryPercentage.toFixed(1)}%`);
  }, [inventoryPercentage]);

  return (
    <DashboardWidget
      title="Inventory Levels"
      className="col-span-5 text-secondary-lighter relative min-h-40 flex"
      titleClassName="z-10 absolute top-4 left-4 text-secondary-lighter"
      contentClassName="p-0"
    >
      {/* Left Side - Pie Chart */}
      <div className="flex-[1.5] flex flex-col items-center justify-center rounded-2xl pb-6 pt-16">
        <svg ref={pieChartRef} className="w-[150px] h-[150px] font-semibold" />

        {/* Inventory Count with Icon */}
        <div className="flex items-center gap-2 pt-4">
          <Package
            size="1em"
            strokeWidth={2.5}
            className="text-secondary-lighter"
          />
          <p className="text-secondary-lighter font-semibold">
            {CURRENT_INVENTORY} / {MAX_CAPACITY} Max
          </p>
        </div>
      </div>
      {/* Right Side - Stats */}
<div className="flex flex-col flex-1 text-secondary-lighter">
  <div className="p-4 rounded-2xl shadow-md relative flex flex-col items-center justify-center flex-1 w-full">
    <p className="text-sm font-semibold absolute top-2 left-3">Total Products</p>
    <p className="text-xl font-medium">{CURRENT_INVENTORY}</p>
  </div>
  <div className="p-4 rounded-2xl shadow-md relative flex flex-col items-center justify-center flex-1 w-full">
    <p className="text-sm font-semibold absolute top-2 left-3">Low Stock Items</p>
    <p className="text-xl font-medium">5</p>
  </div>
  <div className="p-4 rounded-2xl shadow-md relative flex flex-col items-center justify-center flex-1 w-full">
    <p className="text-sm font-semibold absolute top-2 left-3">Out of Stock Items</p>
    <p className="text-xl font-medium">2</p>
  </div>
</div>

    </DashboardWidget>
  );
}
