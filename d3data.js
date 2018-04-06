

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
            "talksto": [ 'ssbn', 'ssbn2', 'gep', 'sat'],

          },
          "ssbn": {
            "name": "ssbn",
            "system": "ssbn",
            "img": "assets/icons/ssbn.png",
            "width": 181,
            "height": 64,
            "midx": 1208,
            "midy": 270,
            "talksto": [ 'tacamo' ],
          },
          "ssbn2": {
            "name": "ssbn2",
            "system": "ssbn",
            "img": "assets/icons/ssbn.png",
            "width": 181,
            "height": 64,
            "midx": 1208,
            "midy": 430,
            "talksto": [ 'tacamo' ],
          },
          "gep": {
            "name": "gep",
            "system": "gep",
            "width": 92,
            "height": 96,
            "img": "assets/icons/gep.png",
            "midx": 45,
            "midy": 350,
            "talksto": [ 'tacamo', 'whitehouse', 'pentagon', 'sat'],
          },
          "sat": {
            "name": "sat",
            "system": "sbirs",
            "img": "assets/icons/sat.png",
            "width": 95,
            "height": 64,
            "midx": 47,
            "midy": 31,
            "talksto": [ 'tacamo', 'gep' ],
          },
          "pentagon": {
            "name": "pentagon",
            "system": "nmcc",
            "img": "assets/icons/nmcc_pentagon.png",
            "width": 111,
            "height": 64,
            "midx": 502,
            "midy": 430,
            "talksto": [ 'gep' ],
          },
          "whitehouse": {
            "name": "whitehouse",
            "system": "cjcsan",
            "width": 99,
            "height": 64,
            "img": "assets/icons/whitehouse.png",
            "midx": 720,
            "midy": 494,
            "talksto": [ 'gep' ],
          }
    };
    <!-- end of master node dict -->
    // nodeData
    //
    var architectures = {
        "curpeace" : [ "tacamo", "ssbn", "gep", "sat", "pentagon", "whitehouse" ],
        "futpeace" : [ "tacamo", "ssbn", "gep", "sat", "pentagon", "whitehouse" ],
        "posthab" :  [ "tacamo", "ssbn", "gep", "sat", "pentagon", "whitehouse", "ssbn2" ]
    };


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

