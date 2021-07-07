import React, { useEffect, useState } from 'react'
import { AuthenticationType } from 'azure-maps-control'
const option = {
    // Should be Managed Identity which is implemented only for Backend due to lack of time.
    authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: 'I WILL REMOVE THIS :D',
        clientId: 'I WILL REMOVE THIS :D',
    },
}
/**
 * Props 
 * 
 * Collector / Producer Location 
 * Closest Destination Hub Location
 * Conditionally Render this component only if Destination Hub is chosen
 * Move subKey to KeyVault ( Encrypt )
 *
 */

const CollectorConsumerHubMap = (props) => {
    let animation;
    const [locationSet, updateLocationSet] = useState(false);
    useEffect(() => {
        const initMaps = (initLong, initLat) => {
            console.log('Received .. ' , typeof(initLong), 'AND LAT ' , initLat)
            map = new atlas.Map('myMap', {
                // center: [-33.50331, 149.32615],
                center: [Number(initLong), Number(initLat)],
                // center: [151.2093, -33.8688],
                zoom: 14,
                view: 'Auto',

                //Add authentication details for connecting to Azure Maps.
                authOptions: {
                    authType: AuthenticationType.subscriptionKey,
                    subscriptionKey: '',
                }
            });
        }


        let atlas = window.atlas;
        // LAT: N ; LONG: -W
        // Pass -W, N
        var routePoints = [];
        if (!props.destinationhubmapdata) updateLocationSet(false);
        if (props.maptype !== '' && props.maptype === 'collector-to-producer') {
            if (props.destinationtoproducer && props.destinationtoproducer.availableRoute) {
                initMaps(props.destinationtoproducer.availableRoute.srcPos.longitude, props.destinationtoproducer.availableRoute.srcPos.latitude)
                routePoints.push(new atlas.data.Feature(new atlas.data.Point([props.destinationtoproducer.availableRoute.srcPos.longitude, props.destinationtoproducer.availableRoute.srcPos.latitude]), { _timestamp: new Date(new Date()).getTime() }),)
                routePoints.push(new atlas.data.Feature(new atlas.data.Point([props.destinationtoproducer.availableRoute.destPos.longitude, props.destinationtoproducer.availableRoute.destPos.latitude]), { _timestamp: new Date(new Date()).getTime() }),)
            }
            updateLocationSet(true);
        }
        else {
            if (props.destinationhubmapdata && props.destinationhubmapdata.routes) {
                initMaps(props.destinationhubmapdata.routes[0].legs[0].points[0].longitude, props.destinationhubmapdata.routes[0].legs[0].points[0].latitude)
                props.destinationhubmapdata['routes'][0].legs[0].points.map((eachPoint, index) => {
                    routePoints.push(new atlas.data.Feature(new atlas.data.Point([eachPoint.longitude, eachPoint.latitude]), { _timestamp: new Date(new Date().setMinutes(index + 50)).getTime() }),)
                })
                updateLocationSet(true);
            }
        }

        getMaps();
        function getMaps() {
            if(!map) return;
            //Initialize a map instance.
            //Wait until the map resources are ready.
            map.events.add('ready', function () {

                //Load a custom image icon into the map resources.
                map.imageSprite.createFromTemplate('arrow-icon', 'marker-arrow', 'teal', '#fff').then(function () {

                    //Create data sources and add them to the map.
                    lineSource = new atlas.source.DataSource();
                    pinSource = new atlas.source.DataSource();
                    map.sources.add([lineSource, pinSource]);

                    //Create a layer to render the path.
                    map.layers.add(new atlas.layer.LineLayer(lineSource, null, {
                        strokeColor: 'DodgerBlue',
                        strokeWidth: 3
                    }));

                    //Extract the positions to highlight the full route on the map as a line.
                    var path = [];

                    routePoints.forEach(f => {
                        path.push(f.geometry.coordinates);
                    });

                    //Create a line for the path and add it to the data source.
                    lineSource.add(new atlas.data.LineString(path));

                    //Create a layer to render a symbol which we will animate.
                    map.layers.add(new atlas.layer.SymbolLayer(pinSource, null, {
                        iconOptions: {
                            //Pass in the id of the custom icon that was loaded into the map resources.
                            image: 'arrow-icon',

                            //Anchor the icon to the center of the image.
                            anchor: 'center',

                            //Rotate the icon based on the rotation property on the point data.
                            //The arrow icon being used in this case points down, so we have to rotate it 180 degrees.
                            rotation: ['+', 180, ['get', 'heading']],

                            //Have the rotation align with the map.
                            rotationAlignment: 'map',

                            //For smoother animation, ignore the placement of the icon. This skips the label collision calculations and allows the icon to overlap map labels. 
                            ignorePlacement: true,

                            //For smoother animation, allow symbol to overlap all other symbols on the map.
                            allowOverlap: true
                        },
                        textOptions: {
                            //For smoother animation, ignore the placement of the text. This skips the label collision calculations and allows the text to overlap map labels.
                            ignorePlacement: true,

                            //For smoother animation, allow text to overlap all other symbols on the map.
                            allowOverlap: true
                        }
                    }));

                    //Create a pin and wrap with the shape class and add to data source.
                    pin = new atlas.Shape(routePoints[0]);
                    pinSource.add(pin);

                    //Create the animation.
                    animation = atlas.animations.moveAlongRoute(routePoints, pin, {
                        //Specify the property that contains the timestamp.
                        timestampProperty: 'timestamp',

                        //Capture metadata so that data driven styling can be done.
                        captureMetadata: true,

                        loop: true,
                        rotationOffset: -180,

                        //Animate such that 1 second of animation time = 1 minute of data time.
                        speedMultiplier: 30,

                        //If following enabled, add a map to the animation.
                        map,

                        //Camera options to use when following.
                        zoom: 15,
                        pitch: 45,
                        rotate: true
                    });

                });
            });

        }
    }, [props.destinationhubmapdata, props.loggedInCollectorInfo, locationSet]);


    var map, pin, lineSource, pinSource;
    //Create an array of point features with timestamp information to define a route to animate along.
    //To animate a route, there must be a _timestamp property that has a value from Date.getTime().

    return <div className="map-container" style={{ height: '300px' }}>
        <div id="myMap" style={{ position: "relative", width: "100%", minWidth: "290px", height: "600px" }}></div>
        <div className="maps-accessibility-container">
            {
                props.maptype && props.maptype !== 'collector-to-producer' && locationSet === true ?
                    <div>
                        <h1> Map settings {animation}</h1>
                        <input type="button" value="Play" onClick={() => animation.play()} />
                        <input type="button" value="Pause" onClick={() => animation.pause()} />
                    </div>
                    : null

            }
        </div>
    </div>
}


export default CollectorConsumerHubMap

