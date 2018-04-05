
    console.log("LOAD -- example_5.js");

    //Array.prototype.diff = function(a)  {
    //    return this.filter(function(i) {
    //        return a.indexOf(i) === -1;
    //    });
    //};



    // global
    var svg = d3.select("svg#svg");
    var plot_area = svg.append("g").attr("id", "plot-area").attr("transform", "translate(0,0)" );
    var d3_node_data = convert_my_data( newNodeData);   // array of dicts

    var gnodes = plot_area.selectAll('g');
    var glines;

    // - unique-ify an array
    function unique(list) {
        var result = [];
        $.each(list, function(i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
        });
        return result;
    }


    // - loop lines, show / hide where necessary
    function show_hide_lines(arch, system) {
        lines = d3.selectAll('line');
        console.log( lines.size() );

        if (arch == 'All') {
            lines.style("stroke", "blue").style('opacity', 1);
        } else {
            hidelist = []
            for (i in architectures[arch]) {
                if (architectures['All'].indexOf( arch[i]) ) {
                    hidelist.push(i);
                }
            }
            console.log("hide = " + hidelist);

        }
    }


    // - resize svg (on window resize, e.g.)
    var resizeTimer;
    function resize_svg( s) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout( window_resize(s), 200 );
    }

    function window_resize(s) {
        s.attr("height", "600px")
            .attr("width", $("#page-content-wrapper").width() ) // -- fit to the bootstrap col width
            .attr("top", $("#page-content-wrapper").top )       // -- locate at 0,0 of bootstrap col
            .attr("left", $("#page-content-wrapper").left )     // -- locate at 0,0 of bootstrap col
            .style("position", "absolute")
            .style("background-color", "ivory");
    }

    // - convert our dict of dicts into array of dicts
    function convert_my_data( dict_of_dicts) {
        var array_of_dicts = [];
        for (i in dict_of_dicts) {
            obj = dict_of_dicts[i];
            obj['id'] = i;          // - add in a unique id/name
            array_of_dicts.push( obj);
        }
        return array_of_dicts;
    }

    // - draw lines between our grouped nodes
    function draw_lines_between_gnodes() {

        // gnodes is a global var
        gnodes.each( function(d, i) {
            // - for each node/d
            for (i in d.talksto) {
                // - find all they talk to
                d3.selectAll("image#" + d.talksto[i] )
                    .each( function(dd, ii) {
                        //
                        //draw_a_line( d, dd);

                        //console.log( d.midx, d.midy, dd.midx, dd.midy);
                        var cls1 = d.id + "-" + dd.id;
                        var cls2 = dd.id + "-" + d.id;

                        if (d3.selectAll('line.' + cls1).size() ||
                            d3.selectAll('line.' + cls2).size() ) {
                            console.log("not line: " + cls1 + " /or/ " + cls2 );
                        } else {
                            classes = [ cls1, cls2, d.system, dd.system ]
                            svg.append('line')
                                .style("stroke", "black")   // look up CRYPTO RISK
                                .attr("x1", d.midx)
                                .attr("y1", d.midy)
                                .attr("x2", dd.midx)
                                .attr("y2", dd.midy)
                                .attr('class', unique(classes).join(" ") );
                        }
                    }); //each
                } // NOPE
        });
    }

    function clickednode(d, i) {
        console.log("clicked on '" + d.name + "' (" + i + ")" );
    }

    function dragstarted(d) {
        d3.select(this).raise().classed("active", true);
    }
    function dragged(d) {
        //d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
        d3.select(this)
            .select("image")
            .attr("x", d.x = d3.event.x - (d.width/2) )
            .attr("y", d.y = d3.event.y - (d.height/2) );

        d3.select(this)
            .select("text")
            .attr("x", d.x = d3.event.x)
            .attr("y", d.y = d3.event.y + d.height)
            .style("text-anchor", "middle");
    }

    function dragended(d) {
        var g = d3.select(this);

        //d3.select(this).classed("active", false);
        g.classed("active", false);
        console.log("DRAGEND @ " + d3.event.x + ", " + d3.event.y + " for '" + g.id + "'");
        // store the change
    }

    function handlemouseover(d, i) {
        console.log('mouseover');
    }

    function handlemouseout(d, i) {
        console.log('mouseout');
    }

    // ---------------------------------------------------- document ready function
    $( document ).ready(function() {
        console.log("document.ready!\n\n" );


        $("#menu-toggle").click(function(e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });

        // - resize
        $(window).resize(function() { resize_svg( svg ); });


        // - enable HTML / JS actions
        $('[data-ma-action]').on("click", function(e) {
            e.preventDefault();
            var $this = $(this);
            var action = $(this).data('ma-action');
            console.log("data-ma-action:start = " + action );
            switch(action) {
                case "clear-lines":
                    d3.selectAll("line").style('opacity', 0);
                    break;

                case "show-lines":
                    var selected_arch = $('select#architectures :selected').val();
                    var selected_system = $('select#systems :selected').val();

                    //d3.selectAll("g").style('opacity', 1);

                    if (selected_arch == 'All') {
                        d3.selectAll("line")
                            .style("stroke", "blue")   // look up CRYPTO RISK
                            .style('opacity', 1);
                    } else {
                        show_hide_lines( arch=selected_arch, system=selected_system);
                    }
                    break;
            }
            console.log("data-ma-action:end = " + action);

        });


        // ----------------------------------------------- D3
        var radius = 25;

        svg.attr("height", "600px")
            .attr("width", $("#page-content-wrapper").width() )            // -- fit to the bootstrap col width
            .attr("top", $("#page-content-wrapper").top )                  // -- locate at 0,0 of bootstrap col
            .attr("left", $("#page-content-wrapper").left )                // -- locate at 0,0 of bootstrap col
            .style("background-color", "ivory")
            .style("position", "absolute");

        gnodes = plot_area.selectAll('g')
            .data(d3_node_data)
            .enter().append('g')
            .attr("id", function(d) { return d.id } )
            .attr("class", function(d) { return d.archs.join(" ") + " " + d.system } )
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );

        // - draw icons
        gnodes.append("image")
            .attr("xlink:href", function(d) { return d.img } )
            .attr("x", function(d) { return d.midx - (d.width/2) } )
            .attr("y", function(d) { return d.midy - (d.height/2) } )
            .attr("id", function(d) { return d.id} );

        // - draw text labels
        gnodes.append("text")
            .attr("x", function(d) { return d.midx } )
            .attr("y", function(d) { return d.midy + d.height } )
            .text( function(d) { return d.id } )
            .style("text-anchor", "middle");

        // - draw/append lines to gnodes
        draw_lines_between_gnodes();


        // - add mouse events
        gnodes
            .on("mouseover", handlemouseover)
            .on("mouseout", handlemouseout)
            .on("click", clickednode );

        // ----------------------------------------------- D3


        // - HTML, bootstrap ----------
        var archnames = {
            'curpeace': 'Current Peacetime',
            'futpeace': 'Future Peacetime',
            'posthab' : 'Post HAB',
            };

        for (i in archnames ) {
            jQuery('<option/>', {
                value: i,
                html: archnames[i],
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

        //console.log( d3_node_data);
        //console.log( gnodes.data() );

    });
    // ---------------------------------------------------- document ready function
