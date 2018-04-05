
    console.log("LOAD -- example_6.js");

    //Array.prototype.diff = function(a)  {
    //    return this.filter(function(i) {
    //        return a.indexOf(i) === -1;
    //    });
    //};



    // global
    var gX, gY;

    var radius = 25;
    var text_adj = 25;
    var newLineData = [];
    var svg = d3.select("svg#svg");
    var d3_node_data = convert_my_data( newNodeData);   // array of dicts

    var plot_layer = svg.append("g").attr("id", "plot-layer").attr("transform", "translate(0,0)" );
    var gnodes = plot_layer.selectAll('g');

    var line_layer = svg.append("g").attr("id", "line-layer").attr("transform", "translate(0,0)" );
    var glines = line_layer.selectAll('line');

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

        if (arch == 'All') {
            line_layer.style('opacity', 1).style('stroke', 'black');
        } else {
            line_layer.style('opacity', 0).style('stroke', 'black');
            line_layer.selectAll('line.' + arch).style('opacity', 1).style('stroke', 'blue');
            console.log( arch);

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

    // --------------- drag
    function dragstarted(d) {
        d3.select(this).raise().classed("active", true);

        // - save starting point in globals
        gX = d3.event.x;
        gY = d3.event.y;
    }

    function dragged(d) {
        // move the imagea
        g = d3.select(this);

        g.select("image")
            .attr("x", d.x = d3.event.x - (d.width/2) )
            .attr("y", d.y = d3.event.y - (d.height/2) )
            .attr("midx", d.x = d3.event.x)
            .attr("midy", d.y = d3.event.y);

        // move text with
        g.select("text")
            .attr("x", d.x = d3.event.x)
            .attr("y", d.y = d3.event.y + d.height - text_adj)
            .style("text-anchor", "middle");

        // fix lines where this is the src
        lines = line_layer
            .selectAll('[src=' + g.attr('id') + ']')
            .style('stroke', 'red')
            .attr('x1', d3.event.x )
            .attr('y1', d3.event.y );
        // fix lines where this is the dst
        lines = line_layer
            .selectAll('[dst=' + g.attr('id') + ']')
            .style('stroke', 'red')
            .attr('x2', d3.event.x )
            .attr('y2', d3.event.y );
    }

    function dragended(d) {
        var g = d3.select(this);
        var nm = g.attr("name");

        g.classed("active", false);

        line_layer.selectAll("line." + g.attr('id') )
            .style('stroke', 'black');

        console.log("DRAGEND @ " + d3.event.x + ", " + d3.event.y + " for '" + nm + "'");
    }

    // --------------- mouse
    function clickednode(d, i) {
        console.log("clicked on '" + d.name + this);
    }

    function handlemouseover(d, i) {
        console.log('mouseover ' + d3.select(this).attr('id')  );
        d3.select(this).selectAll('image').classed('hovered', true);
        d3.select(this).selectAll('text').classed('hovered', true);

    }
    function handlemouseout(d, i) {
        console.log('mouseout ' + d3.select(this).attr('id')  );
        d3.select(this).selectAll('image').classed('hovered', false);
        d3.select(this).selectAll('text').classed('hovered', false);
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
                    line_layer.style('opacity', 0);
                    break;

                case "show-lines":
                    var selected_arch = $('select#architectures :selected').val();
                    var selected_system = $('select#systems :selected').val();
                    show_hide_lines( arch=selected_arch, system=selected_system);
                    break;
            }
            console.log("data-ma-action:end = " + action);

        });


        // ----------------------------------------------- D3

        svg.attr("height", "600px")
            .attr("width", $("#page-content-wrapper").width() )            // -- fit to the bootstrap col width
            .attr("top", $("#page-content-wrapper").top )                  // -- locate at 0,0 of bootstrap col
            .attr("left", $("#page-content-wrapper").left )                // -- locate at 0,0 of bootstrap col
            .style("background-color", "ivory")
            .style("position", "absolute");

        gnodes = plot_layer.selectAll('g')
            .data(d3_node_data)
            .enter().append('g')
            .attr("id", function(d) { return d.id } )
            .attr("name", function(d) { return d.name } )
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
            .attr('midx', function(d) { return d.midx })
            .attr('midy', function(d) { return d.midy })
            .attr("id", function(d) { return d.id} );

        // - draw text labels
        gnodes.append("text")
            .attr("x", function(d) { return d.midx } )
            .attr("y", function(d) { return d.midy + d.height - text_adj } )
            .text( function(d) { return d.id } )
            .style("text-anchor", "middle");

        // - draw all lines
        newLineData = calc_line_data();
        glines = line_layer.selectAll('line')
            .data(newLineData)
            .enter().append('line')
            .style("stroke", "black")
            .attr("x1", function(d) { return d.x1 } )
            .attr("y1", function(d) { return d.y1 } )
            .attr("x2", function(d) { return d.x2 } )
            .attr("y2", function(d) { return d.y2 } )
            .attr("src", function(d) { return d.src } )
            .attr("dst", function(d) { return d.dst } )
            .attr("class", function(d) { return d.src + ' ' + d.dst });

        // tack on architectures as classes to lines, also
        for (arch in architectures) {
            systems = architectures[arch];
            // oops:
            for (s in systems) {
                line_layer.selectAll('line.' + systems[s] ).classed(arch, true);
            }
            // should only have arch class if BOTH nodes are in an arch
        }

        // - add mouse events to image/text groups
        gnodes
            .on("mouseover", handlemouseover)       // hover in
            .on("mouseout", handlemouseout)         // hover out
            .on("click", clickednode )              // click

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
