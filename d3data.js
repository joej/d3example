

<!-- ........ START OF JS NODE DATA ................................ -->

    <!-- start of master node dict -->
    var newNodeData = {
          "tacamo": {
            "name": "tacamo",
            "system": "tacamo",
            "img": "assets/icons/tacamo.png",
            "width": 214,
            "height": 64,
            "midx": 777,
            "midy": 95,
            "archs": [ "curpeace", "futpeace", "futposthab" ],
            "crypto": {
                "kiv7": [ "gep", "sat" ],
                "kgv":  [ "ssbn", "ssbn2" ],
            }
          },
          "ssbn": {
            "name": "ssbn",
            "system": "ssbn",
            "img": "assets/icons/ssbn.png",
            "width": 181,
            "height": 64,
            "midx": 1208,
            "midy": 270,
            "archs": [ "curpeace", "futpeace", "futposthab" ],
            "crypto": {
                "kgv": [ "tacamo", ]
            }
          },
          "ssbnr2": {
            "name": "ssbn2",
            "system": "ssbn",
            "img": "assets/icons/ssbn.png",
            "width": 181,
            "height": 64,
            "midx": 1208,
            "midy": 430,
            "archs": [ "curpeace", "futpeace", "futposthab" ],
            "crypto": {
                "kgv": [ "tacamo", ]
            }
          },
          "gep": {
            "name": "gep",
            "system": "gep",
            "width": 92,
            "height": 96,
            "img": "assets/icons/gep.png",
            "midx": 45,
            "midy": 350,
            "archs": [ "curpeace", "futpeace", "futposthab" ],
            "crypto": {
                "kiv7": [ "tacamo", ],
            }
          },
          "sat": {
            "name": "sat",
            "system": "sbirs",
            "img": "assets/icons/sat.png",
            "width": 95,
            "height": 64,
            "midx": 47,
            "midy": 31,
            "archs": [ "curpeace", "futpeace", "futposthab" ],
          },
          "pentagon": {
            "name": "pentagon",
            "system": "nmcc",
            "img": "assets/icons/nmcc_pentagon.png",
            "width": 111,
            "height": 64,
            "midx": 502,
            "midy": 430,
            "archs": [ "curpeace", "futpeace", "futposthab" ],
          },
          "whitehouse": {
            "name": "whitehouse",
            "system": "cjcsan",
            "width": 99,
            "height": 64,
            "img": "assets/icons/whitehouse.png",
            "midx": 720,
            "midy": 494,
            "archs": [ "curpeace", "futpeace", "futposthab" ],
          }
    };
    <!-- end of master node dict -->
    // nodeData

    function farthestX() {
        var maxX = 0;
        Object.keys(newNodeData).forEach(function(k,i) {
            x = newNodeData[k].midx + newNodeData[k].width ;
            if (maxX < x ){ maxX = x; };
        });
        return maxX
    }

    // - could be used to build the crypto menu
    function cryptodevs_list() {
        // - list of crypto devices
        var cryptodevs = [];
        Object.keys(newNodeData).forEach(function(k, i) {
            console.log(k);
            obj = newNodeData[k];
            for (i in obj.crypto) {
                if (!cryptodevs.includes(i) ) {
                    cryptodevs.push( i );
                    console.log(">> " + i );
                }
            }
        });
        console.log("return: " + cryptodevs);
        return cryptodevs;
    }
<!-- .......... END OF JS NODE DATA ................................ -->

