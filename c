
    //var ctx = svg;
    //ctx.lineWidth = 3;
    //var $svg = $("#svg");
    //var svgOffset = $svg.offset();
    //var offsetX = svgOffset.left;
    //var offsetY = svgOffset.top;


    function draw_nodes() {
        // - draw icon/image nodes on the svg, based on newNodeData data

        var DRAWIMAGES = false;
        var DRAWCIRCLES = true;

        for (i in newNodeData) {
            //console.log( "place: " + JSON.stringify(newNodeData[i]) );

            obj = newNodeData[i];
            //console.log("obj = "); console.log(obj);
            if (DRAWIMAGES) {
                svg.append("image")
                    .attr("xlink:href", obj.img)
                    .attr("x", obj.midx - (obj.width/2))
                    .attr("y", obj.midy - (obj.height/2))
                    .attr("class", obj.system)
                    .attr("id", obj.name);

                svg.append("text")
                    .attr("dx", obj.midx)
                    .attr("dy", obj.midy+obj.height)
                    .text(obj.name)
                    .style("text-anchor", "middle");

            }
            if (DRAWCIRCLES) {

                x = svg.append("circle")
                    .attr("cx", obj.midx )
                    .attr("cy", obj.midy  )
                    .attr("r", 25)
                    .style("fill", "blue");

                console.log(x);

                x.on("mouseover", handlemouseover).on("mouseout", handlemouseout);

                svg.append("text")
                    .attr("dx", obj.midx)
                    .attr("dy", obj.midy+obj.height)
                    .text(obj.name)
                    .style("text-anchor", "middle");

                svg.selectAll("circle").data(obj);
                svg.selectAll("circle").on("click", function(d) { console.log(d); });
            }
        }
    }
