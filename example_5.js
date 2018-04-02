

    var radius = 25;
    var svg = d3.select("svg#svg")
        //.attr("height", $("#page-content-wrapper").height() )          // -- fit to the bootstrap col height
        .attr("height", "600px")
        .attr("width", $("#page-content-wrapper").width() )            // -- fit to the bootstrap col width
        .attr("top", $("#page-content-wrapper").top )                  // -- locate at 0,0 of bootstrap col
        .attr("left", $("#page-content-wrapper").left )                // -- locate at 0,0 of bootstrap col
        .style("background-color", "ivory")
        //.style("border", "1px solid red")
        .style("position", "absolute");

    function handlemouseover(d, i) {
        console.log('mouseover');
    }
    function handlemouseout(d, i) {
        console.log('mouseout');
    }

    // ---------------------------------------------------- document ready function
    $( document ).ready(function() {
        console.log("\nready!" );


        $("#menu-toggle").click(function(e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });

        // - resize
        $(window).resize(function() {
            console.log('resize');
            svg.attr("height", "600px")
                .attr("width", $("#page-content-wrapper").width() ) // -- fit to the bootstrap col width
                .attr("top", $("#page-content-wrapper").top )       // -- locate at 0,0 of bootstrap col
                .attr("left", $("#page-content-wrapper").left )     // -- locate at 0,0 of bootstrap col
                .style("position", "absolute")
                .style("background-color", "ivory");
        });


        // - enable actions
        $('[data-ma-action]').on("click", function(e) {
            e.preventDefault();
            var $this = $(this);
            var action = $(this).data('ma-action');
            console.log("data-ma-action:start = " + action );
            switch(action) {
                case "clear-lines":
                    d3.selectAll("circle").style('opacity', 0);
                    d3.selectAll("text").style('opacity', 0);
                    d3.selectAll("image").style('opacity', 0);
                    d3.selectAll("line").style('opacity', 0);
                    break;
                case "show-lines":
                    d3.selectAll("circle").style('opacity', 1);
                    d3.selectAll("text").style('opacity', 1);
                    d3.selectAll("image").style('opacity', 1);

                    // - draw lines
                    d3.selectAll("image")
                        .each( function(d, i) {
                            // - for each node/d
                            for (i in d.talksto) {
                                // - find all they talk to
                                d3.selectAll("image#" + d.talksto[i] )
                                    .each( function(dd, ii) {
                                        // - plot line from d to other node
                                        svg.append("line")
                                            .style("stroke", "black")   // look up CRYPTO RISK
                                            .attr("x1", d.midx)
                                            .attr("y1", d.midy)
                                            .attr("x2", dd.midx)
                                            .attr("y2", dd.midy);
                                    });
                            }
                        });
                    break;
            }
            console.log("data-ma-action:end = " + action);

        });


        // the d3 "way" ---------------
        var d3_node_data = [];
        for (i in newNodeData) {
            obj = newNodeData[i];
            obj['id'] = i;          // - unique id/name
            obj['pulse'] = false;
            d3_node_data.push( obj);
        }
        var plot_area = svg.append("g").attr("id", "plot-area").attr("transform", "translate(0,0)" );
        var circles = plot_area.selectAll("circle").data(d3_node_data);


        DOCIRCLES = false;
        DOIMAGES = true;

        if (DOIMAGES) {
            // plot circles
            circles.enter()
                .append("image")
                .attr("xlink:href", function(d) { return d.img } )
                .attr("x", function(d) { return d.midx - (d.width/2) } )
                .attr("y", function(d) { return d.midy - (d.height/2) } )
                .attr("id", function(d) { return d.id} );

            // - mouse in/out
            plot_area.selectAll("image")
                .on("mouseover", handlemouseover).on("mouseout", handlemouseout)
                .on("click", function(d) {
                    // d = the dict for this clicked'd circle
                    //d.pulse = !d.pulse;
                    // DO SOMETHING
                    console.log("clicked on '" + d.name + "'" );
            });

            // - add text
            circles.enter()
                .append("text")
                .attr("dx", function(d) { return d.midx } )
                .attr("dy", function(d) { return d.midy + d.height } )
                .text( function(d) { return d.id } )
                .style("text-anchor", "middle");
        }

        if (DOCIRCLES) {
            circles.enter()
                .append("circle")
                .attr("cx", function(d) { return d.midx } )
                .attr("cy", function(d) { return d.midy } )
                .attr("r", radius)
                .attr('id', function(d) { return d.id } )
                .style("fill", "white")
                .style("stroke", "blue")
                .attr("stroke-width", 2);

            plot_area.selectAll("circle")
                .on("mouseover", handlemouseover).on("mouseout", handlemouseout)
                .on("click", function(d) {
                    // d = the dict for this clicked'd circle
                    //d.pulse = !d.pulse;
                    // DO SOMETHING
                    console.log("clicked on '" + d.name);
            });

        }
        // end the d3 "way" ---------------
        //
        //

        // - HTML, bootstrap ----------
        var architectures = [ 'curpeace', 'futpeace', 'posthab' ];
        for (i in architectures) {
            jQuery('<option/>', {
                value: architectures[i],
                html: architectures[i],
                }).appendTo('select#architectures'); //appends to select if parent div has id dropdown
        };

        var systems = [];
        var names = [];
        for (i in newNodeData) {
            //console.log('i = ' + i);        // strings for each key
            obj = newNodeData[i];

            systems.push( obj.system);
            jQuery('<option/>', {
                value: obj.system,
                html: obj.system,
                }).appendTo('select#systems'); //appends to select if parent div has id dropdown

            names.push( obj.name);
            jQuery('<option/>', {
                value:  obj.name,
                html: obj.name,
                }).appendTo('select#names'); //appends to select if parent div has id dropdown
        }
    });

