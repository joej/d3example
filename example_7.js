
    console.log("LOAD -- example_6.js");

    //Array.prototype.diff = function(a)  {
    //    return this.filter(function(i) {
    //        return a.indexOf(i) === -1;
    //    });
    //};



    // global constants
    var radius = 25;
    var text_adj = 25;

    // - data
    var d3_node_data = convert_my_data(newNodeData);   // array of dicts
    var newLineData = [];

    // global vars
    var svg = d3.select("svg#svg");

    var plot_layer; // = svg.append("g").attr("id", "plot-layer").attr("transform", "translate(0,0)" );
    var gnodes;

    var line_layer; // = svg.append("g").attr("id", "line-layer").attr("transform", "translate(0,0)" );
    var glines;

    // global flags, controls
    var gX, gY;
    var gArchitecture = 'All';
    var gSystem = 'All';


    // - unique-ify an array
    function unique(list) {
        var result = [];
        $.each(list, function(i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
        });
        return result;
    }

    function hide_svg() {
        line_layer.selectAll('line').style('opacity', 0);
        plot_layer.selectAll('image').style('opacity', 0);
        plot_layer.selectAll('text').style('opacity', 0);
    }


    // - loop lines, show / hide where necessary
    function show_svg() {

        arch = gArchitecture;
        system = gSystem;


        if (arch == 'All') {


            line_layer.selectAll('line')
                .style('stroke', 'black')
                .style('opacity', 1);
            plot_layer.selectAll('image').style('opacity', 1);
            plot_layer.selectAll('text').style('opacity', 1);

        } else {

            line_layer.selectAll('line')
                .style('opacity', 0);
            line_layer.selectAll('line.' + arch)
                .style('opacity', 1).style('stroke', 'blue');

            plot_layer.selectAll('image').style('opacity', 0.5);
            plot_layer.selectAll('image.' + arch).style('opacity', 1);

            plot_layer.selectAll('text').style('opacity', 0.5);
            plot_layer.selectAll('text.' + arch).style('opacity', 1);

        }
    }


    // - resize svg (on window resize, e.g.)
    var resizeTimer;
    function resize_svg( s) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout( window_resize(s), 200 );
    }

    function window_resize(s) {
        s.attr("top", $("#page-content-wrapper").top )
            .attr("left", $("#page-content-wrapper").left )
            //.attr("height", "600px")
            //.attr("width", $("#page-content-wrapper").width() )
            .style("position", "absolute")
            .attr('viewBox', "0 0 1304 600")
            .style("background-color", "ivory");
    }

    // - calculate lines
    function calc_line_data() {
        // - pull out line-specific data
        var ret_array = [];

        for (i in newNodeData) {
            tempd = [];
            src = newNodeData[i];
            for (j in src.talksto) {
                peernm = src.talksto[j];        // name of comms-peer system
                dst = newNodeData[peernm];      // peer's data

                idstr = i + "-" + peernm;
                tempd = {
                    'id': idstr,
                    'src': i,
                    //
                    'x1': src['midx'],
                    'y1': src['midy'],

                    'dst': peernm,
                    'x2': dst['midx'],
                    'y2': dst['midy'],
                    'archs': [],
                }
                for (arch in architectures) {
                    if ( (architectures[arch].indexOf(i) >= 0) &&
                        (architectures[arch].indexOf(peernm) >= 0) ){
                        //console.log(i + '-' + peernm + " adds " + arch);
                        tempd.archs.push( arch);
                    }
                    //else { console.log(i + '-' + peernm + " NOT " + arch); }
                } // arch in archs


            }
            ret_array.push( tempd);
        }
        return ret_array;
    };


    // - convert our dict of dicts into array of dicts
    function convert_my_data(dict_of_dicts) {
        var array_of_dicts = [];


        for (i in dict_of_dicts) {

            // - alter the dict into obj-dict
            obj = dict_of_dicts[i];
            obj['id'] = i;  // id is the key/name field
            obj['archs'] = [];


            // - add 'archs'
            for (arch in architectures) {
                if (architectures[arch].indexOf(i) >= 0) {
                    obj['archs'].push( arch);
                    console.log('data ... ' + i + " gets " + arch);
                } else {
                    console.log('data ... ' + i + " NOT " + arch);
                }
            } // arch in archs
            console.log("So: archs for '" + i + "' is = '" + obj['archs'] + "'" );

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
            .style('stroke', 'gray')
            .style('stroke-width', 1)
            .attr('x1', d3.event.x )
            .attr('y1', d3.event.y );
        // fix lines where this is the dst
        lines = line_layer
            .selectAll('[dst=' + g.attr('id') + ']')
            .style('stroke', 'gray')
            .style('stroke-width', 1)
            .attr('x2', d3.event.x )
            .attr('y2', d3.event.y );
    }

    function dragended(d) {
        var g = d3.select(this);
        var nm = g.attr("name");

        g.classed("active", false);

        line_layer.selectAll("line." + g.attr('id') )
            .style("stroke", "black")
            .style("stroke-width", 2);

        console.log("DRAGEND @ " + d3.event.x + ", " + d3.event.y + " for '" + nm + "'");
    }

    // --------------- mouse
    function clickednode(d, i) {
        console.log("clicked on '" + d.name + this);
    }

    function handlemouseover(d, i) {
        idstr = d3.select(this).attr('id');
        console.log('mouseover ' + idstr );

        d3.select(this).selectAll('image').classed('hovered', true);
        d3.select(this).selectAll('text').classed('hovered', true);

        line_layer.selectAll('line.'+idstr)
            .style('stroke', 'blue')
            .style('stroke-width', 3);

    }
    function handlemouseout(d, i) {
        console.log('mouseout ' + d3.select(this).attr('id')  );
        d3.select(this).selectAll('image').classed('hovered', false);
        d3.select(this).selectAll('text').classed('hovered', false);

        line_layer.selectAll('line.'+idstr)
            .style('stroke', 'black')
            .style('stroke-width', 1);
    }



    function remove_svg() {
        svg.selectAll("*").remove();
        svg = d3.select("svg#svg");
    }

    function update_svg() {
        console.log("BEFORE update: ------------------------------------");
        console.log("line = "  + d3.selectAll('line').size() );
        console.log("g = "     + d3.selectAll('g').size() );
        console.log("text = "  + d3.selectAll('text').size() );
        console.log("image = " + d3.selectAll('image').size() );


        // - resize it
        svg.attr('viewBox', "0 0 1304 600")
            //.attr("height", "600px")
            //.attr("width", $("#page-content-wrapper").width() )
            .attr("top", $("#page-content-wrapper").top )                  // -- locate at 0,0 of bootstrap col
            .attr("left", $("#page-content-wrapper").left )                // -- locate at 0,0 of bootstrap col
            .style("background-color", "ivory")
            .style("position", "absolute");

        // - this creates the g, lines, images !
        remove_svg();
        draw_svg();

        console.log("AFTER update: ------------------------------------");
        console.log("line = "  + d3.selectAll('line').size() );
        console.log("g = "     + d3.selectAll('g').size() );
        console.log("text = "  + d3.selectAll('text').size() );
        console.log("image = " + d3.selectAll('image').size() );
    }

    function draw_svg() {
        // ----------------------------------------------- D3

        svg = d3.select("svg#svg");
        console.log("draw: svg = " + svg);

        svg.attr('viewBox', "0 0 1304 600")
            //.attr("height", "600px")
            //.attr("width", $("#page-content-wrapper").width() )            // -- fit to the bootstrap col width
            .attr("top", $("#page-content-wrapper").top )                  // -- locate at 0,0 of bootstrap col
            .attr("left", $("#page-content-wrapper").left )                // -- locate at 0,0 of bootstrap col
            .style("background-color", "ivory")
            .style("position", "absolute");

        // - draw all lines
        newLineData = calc_line_data(); // update line data
        console.log("draw: newLineData = '", newLineData );

        line_layer = svg.append("g").attr("id", "line-layer").attr("transform", "translate(0,0)" );
        glines = line_layer.selectAll('line')
            .data(newLineData)
            .enter().append('line')
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr("x1", function(d) { return d.x1 } )
            .attr("y1", function(d) { return d.y1 } )
            .attr("x2", function(d) { return d.x2 } )
            .attr("y2", function(d) { return d.y2 } )
            .attr("src", function(d) { return d.src } )
            .attr("dst", function(d) { return d.dst } )
            .attr("data-systems", function(d) { return [d.src, d.dst] } )
            .attr("data-archs", function(d){ return d.archs })
            .attr("class", function(d) { return d.src + ' ' + d.dst + " " + d.archs.join(" ") });
        console.log("draw: line_layer = '" + line_layer.size() + "'");
        console.log("draw: glines = '" + glines.size() + "'");

        // -- attach the data, create the IMAGE/TEXT groups
        d3_node_data = convert_my_data(newNodeData);   // update nodes data
        plot_layer = svg.append("g").attr("id", "plot-layer").attr("transform", "translate(0,0)" );
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
        console.log("draw: plot_layer = '" + plot_layer.size() + "'");

        // - draw icons
        gnodes.append("image")
            .attr("xlink:href", function(d) { return d.img } )

            .attr('height', function(d) { return d.height })
            .attr('width', function(d) { return d.width })


            .attr("x", function(d) { return d.midx - (d.width/2)  } )
            .attr("y", function(d) { return d.midy - (d.height/2) } )
            .attr('midx', function(d) { return d.midx })
            .attr('midy', function(d) { return d.midy })
            .attr("data-archs", function(d){ return d.archs })
            .attr("class", function(d) { return d.archs.join(" ") })

            .attr("id", function(d) { return d.id} );
        console.log("draw: gnodes img = '" + svg.selectAll('image').size() + "'");

        // - draw text labels
        gnodes.append("text")
            .attr("x", function(d) { return d.midx } )
            .attr("y", function(d) { return d.midy + d.height - text_adj } )
            .text( function(d) { return d.id } )
            .style("text-anchor", "middle");
        console.log("draw: gnodes txt = '" + svg.selectAll('text').size() + "'");


        // - add mouse events to image/text groups
        gnodes
            .on("mouseover", handlemouseover)       // hover in
            .on("mouseout", handlemouseout)         // hover out
            .on("click", clickednode )              // click

        // ----------------------------------------------- D3
    } // - draw_svg
    // ---------------------------------------------------- document ready function
    $( document ).ready(function() {
        console.log("document.ready!\n\n" );


        // - button does not exist on our page ;-)
        $("#menu-toggle").click(function(e) {

            e.preventDefault();
            //$(this).html('<i class="glyphicon glyphicon-menu-right"></i>');

            $(this).find('i.glyphicon')
                .toggleClass('glyphicon-chevron-left')
                .toggleClass('glyphicon-chevron-right');

            $("#wrapper").toggleClass("toggled");

        });

        // - EVENTS
        // -- resize
        $(window).resize(function() { resize_svg( svg ); });
        // -- architectures
        $('select#architectures').on('change', function() {
            gArchitecture = $('select#architectures :selected').val();
            show_svg();
        });
        // -- systems
        $('select#systems').on('change', function() {
            gSystem = $('select#systems :selected').val();
            remove_svg();
            update_svg();
        });

        // - enable HTML / JS actions
        $('[data-ma-action]').on("click", function(e) {
            e.preventDefault();
            var $this = $(this);
            var action = $(this).data('ma-action');
            console.log("data-ma-action:start = " + action );
            switch(action) {

                case 'svg-remove':
                    remove_svg();
                    break;

                case 'svg-update':
                    update_svg();
                    break;

                case "svg-hide":
                    hide_svg();
                    break;

                case "svg-show":
                    show_svg();
                    break;
            }
            console.log("data-ma-action:end = " + action);

        });

        // -- plot out plot_layer and line_layer sets of objects on the svg
        // ----------------------------------------------------------------
        draw_svg();

        // ----------------------------------------------------------------

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
