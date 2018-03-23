    function connect() {

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
            //console.log("\n");

        } // - for
    }
    // - build array of "lines"
    var connectors = [];
    connectors.push({ from: $("#tacamo"), to: $("#ssbn") });
    connectors.push({ from: $("#tacamo"), to: $("#ssbn2") });
    connectors.push({ from: $("#sat"), to: $("#gep") });
    connectors.push({ from: $("#pentagon"), to: $("#gep") });
    connectors.push({ from: $("#sat"), to: $("#tacamo") });
    connectors.push({ from: $("#gep"), to: $("#tacamo") });
    connectors.push({ from: $("#pentagon"), to: $("#whitehouse") });
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
