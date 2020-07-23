import * as d3 from "d3";

export class chartGenerator {

    
    static seperateAxisPrioritizedBarChartGenerator(height: number, width: number, graphSVGElement: any, queryResult: Array<object>, xAxisKey: string, yAxisKey: string, axisWidth:number = 100, barColor:string = "rgba(135, 194, 205, 0.58639)") {
        
        // Clear SVG Elements of old data
        graphSVGElement.selectAll("*").remove();

        const margin = {top: 20, right: 20, bottom: 50, left: 70};
    
        // Create an Array for each Axis
        let xAxisData: any = queryResult.map(d => parseFloat((<any>d)[xAxisKey]));
        const yAxisData: any = queryResult.map(d => parseFloat((<any>d)[yAxisKey]));
    
        // Create a D3 Linear Scale for the Y-Axis
        const yScale = d3.scaleLinear()
            .domain([0, d3.max<any>(yAxisData)])
            .range([0, height]);
    
        // Create a D3 Linear Scale for the Y-Axis Label
        // We negate the height here so that the bars are drawn correctly
        const yAxisScale: any = d3.scaleLinear<string>()
            .domain([0, d3.max<any>(yAxisData)])
            .range(<any>([0, -height]));
    
        // Create a D3 Band Scale for the X-Axis
        // A static SVG will have a fixed size no matter the number of elements
        // Here, the width parameter is treated as the width of each bar in the graph
        let range: any = d3.range(xAxisData.length);
        let xScale = d3.scaleBand()
            .domain(range)
            .range([0, width]);
    
        // Setup SVG element attributes 
        graphSVGElement
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .attr("font-family", "sans-serif")
            .attr("font-size", "10")
            .attr("text-anchor", "end")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
        if(xScale.bandwidth() <= 1) {
            let rangeData: any = d3.range(xAxisData.length)
            xScale = d3.scaleBand()
                .domain(rangeData)
                .range([0, xAxisData.length * 3]);
    
            // Set up SVG element for graph
            graphSVGElement
                .attr("height", height)
                .attr("width", xScale.range()[1] + 25)
                .attr("font-family", "sans-serif")
                .attr("font-size", "10")
                .attr("text-anchor", "end");
        }

        // X axis Label
        graphSVGElement.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("font-family", "Roboto")
            .attr("font-weight", "500")
            .attr("font-size", "12px")
            .attr("x", width/2)
            .attr("y", height +20)
            .text("Time (hour)");

        // Y axis Label
        graphSVGElement.append("text")
            
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("font-family", "Roboto")
            .attr("font-weight", "500")
            .attr("font-size", "12px")
            .attr("x", -height/2)
            .attr("y", 10)
            .attr("transform", "rotate(-90)")
            .text("XTZ (ꜩ)");

        // Create selection for bar graph bars
        const bar = graphSVGElement.selectAll("g")
            .data(yAxisData) //Attach bars to Y-Axis data
            .join("g")
                .attr("transform", (d: any, i: any) => `translate(${xScale(i)}, ${height - yScale(d)})`);
        
        bar.append("rect")
            .style("stroke-width", "1")
            .style("stroke", "#56C2D9") 
            .attr("fill", barColor)
            .attr("width", xScale.bandwidth() - 7) // Sets a padding of five pixel between bars
            .attr("height", yScale);
    }

    static barGraphFloatingTooltipGenerator(graphSVGElement: any, xLabelFunction: Function, yLabelFunction: Function) {
        
        //Select all bar graph bar elements
        const bar = graphSVGElement.selectAll("g")
        
        // Set up tooltip for graph data viewing
        const tooltip = d3.select("body").append("div").attr("class", "graphToolTip");
    
        // Add event listener for tooltip
        bar.on("mousemove", function(d: any, i: number) {
            tooltip
                .style("left", d3.event.pageX + 20 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .style("position", "absolute")
                .style("text-align", "center")
                .style("background", "#313C4E")
                .style("box-shadow", "1.5px 2.5px 4px rgba(119, 119, 119, 0.25)")
                .style("font-family", "Roboto")
                .style("font-size", "8px")
                .style("line-height", "15px")
                .style("letter-spacing", "0.4px")
                .style("color", "#ffffff")
                .style("padding", "10px 15px")
                .html(yLabelFunction(d, i) + "<br>" + xLabelFunction(d, i));
        })
            .on("mouseout", function(d: any){ tooltip.style("display", "none");
        });
    }
    
}