    var DUMPNODES = false;
    if  (DUMPNODES) {
        // -- build node list
        nodeData = [];
        nodeArr = [ 'tacamo', 'ssbn', 'ssbn2', 'gep', 'sat', 'pentagon', 'whitehouse' ];
        for (var nm in nodeArr) {
            idstring = "#" + nodeArr[nm];
            obj = $(idstring);
            nodeData.push( {
                'name':     nodeArr[nm],
                //'realleft': obj.offset().left - offsetX,
                //'realtop':  obj.offset().top - offsetY,
                'midx':     obj.offset().left - offsetX + (obj.width() / 2),
                'midy':     obj.offset().top  - offsetY + (obj.height() / 2)
            });
        }
        console.log( JSON.stringify( nodeData, null, 2 ) );
    } // DUMPNODES

    var OLDLINES = false;
    if (OLDLINES) {
    lineData = [];
        for (var i in connectors)  {
            //console.log("i = " + i );
            c = connectors[i];
            lineData.push({ 
                x1: c.from.offset().left - offsetX + (c.from.width() / 2), 
                y1: c.from.offset().top  - offsetY + (c.from.height() / 2), 
                x2: c.to.offset().left - offsetX +  (c.to.width() / 2), 
                y2: c.to.offset().top  - offsetY + (c.to.height() / 2)
            });
        }
        //console.log( lineData);
        //console.log( JSON.stringify(lineData) );

        // - draw the lines
        //connect();
    }

    //$(".draggable").draggable();
    //$(".draggable").draggable({
    //    // event handlers
    //    start: noop,
    //    drag: connect,
    //    stop: noop
    //});

    function noop() {}

    function draw_nodes() {
        // - draw icon/image nodes on the svg, based on nodeData data

        var DRAWIMAGES = true;
        var DRAWCIRCLES = false;
        //var URL_PREPEND = "http://toast.mitre.org/~judge/d3example/";
        for (i in nodeData) {
            //console.log( "place: " + JSON.stringify(nodeData[i]) );

            obj = nodeData[i]
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
                svg.append("circle")
                    .attr("cx", obj.midx )
                    .attr("cy", obj.midy  )
                    .attr("r", 25)
                    .style("fill", "blue");
            }
        }
    }


    function connect() {
        //ctx.clearRect(0, 0, svg.width, svg.height);
        //$svg.selectAll("*?).remove();

        //console.log("connectors:");
        for (var i = 0; i < connectors.length; i++) {
            var c = connectors[i];
            var eFrom = c.from;
            var eTo = c.to;
            var pos1 = eFrom.offset();
            var pos2 = eTo.offset();
            var size1 = eFrom.length;
            var size2 = eTo.length;

            // -- move to start of line
            //ctx.moveTo( c.from.offset().left + (c.from.width() / 2) - svgOffset.left, 
                // - Y = at the midway point between its top and bottom
                //pos1.top + (eFrom.height() / 2) );

            // -- draw the line
            //ctx.lineTo(pos2.left + (eTo.width() / 2) - offsetX, pos2.top + (eTo.height() / 2) -  offsetY);

            svg.append("line")
                .style("stroke", "black")
                .attr("x1", c.from.offset().left - offsetX + (c.from.width() / 2) )
                .attr("y1", c.from.offset().top  - offsetY + (c.from.height() / 2) )             // this is correct
                .attr("x2", c.to.offset().left - offsetX +  (c.to.width() / 2))
                .attr("y2", c.to.offset().top  - offsetY + (c.to.height() / 2));

            //console.log("from = ", c.from);
            //console.log("x1", c.from.position().left + (c.from.width() / 2), "y1", c.from.position().top +  (c.from.height() / 2) );
            //console.log("to = ", c.from);
            //console.log("x2", c.to.offset().left - offsetX +  (c.to.width() / 2), "y2", c.to.offset().top  - offsetY + (c.to.height() / 2));
