
import React, { useEffect } from 'react';
import './StyleMap.css';

const Map = () => 
{
    let map, directionsService, directionsDisplay, currentLocation;

    function initMap() 
    {
        currentLocation = { lat: 0, lng: 0 };
        map = new window.google.maps.Map(document.getElementById('map'), {
            center: currentLocation,
            zoom: 18
        });
        directionsService = new window.google.maps.DirectionsService();
        directionsDisplay = new window.google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);

        navigator.geolocation.getCurrentPosition(function (position) {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(currentLocation);

            var marker = new window.google.maps.Marker({
                position: currentLocation,
                map: map,
                title: 'Current Location'
            });
        });
    }
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        script.onerror = () => {
            console.error(`Error loading script: ${url}`);
        };
        document.body.appendChild(script);
    }

    useEffect(() => {
        loadScript(`https://maps.googleapis.com/maps/api/js?key=AIzaSyDfJ4KrjD_b0b5wKUMKZFTQU6Erac6Hq10&callback=initMap`, () => {
            initMap();
        });

        loadScript(`https://maps.googleapis.com/maps/api/js?key=AIzaSyDfJ4KrjD_b0b5wKUMKZFTQU6Erac6Hq10&libraries=places&callback=initAutocomplete`, () => {
            // Initialize autocomplete after the script loads
            initAutocomplete();
        });
    }, []);

    function calculateAndDisplayRoute(directionsService, directionsRenderer, start, end) {
        directionsService.route({
            origin: start,
            destination: end,
            travelMode: window.google.maps.TravelMode.DRIVING
        }, (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
                showTurns(response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        });
    }


    function initAutocomplete() {
        const searchInput = document.getElementById('destination');
        const autocomplete = new window.google.maps.places.Autocomplete(searchInput);
    }

    function calculateRoute() {
        var destination = document.getElementById('destination').value;

        var request = {
            origin: currentLocation,
            destination: destination,
            travelMode: 'DRIVING',
            drivingOptions: {
                departureTime: new Date(Date.now()),
            }
        };

        directionsService.route(request, function (result, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(result);
                showTravelTime();
                calculateAndDisplayRoute(directionsService, directionsDisplay, currentLocation, destination);
            }
        });
    }
    function showTravelTime() {
        var dest = document.getElementById('destination').value;

        var request = {
            origin: map.getCenter(),
            destination: dest,
            travelMode: 'DRIVING'
        };

        directionsService.route(request, function (result, status) {
            if (status === 'OK') {
                var route = result.routes[0];
                var duration = route.legs[0].duration.text;

                document.getElementById('travelTime').innerHTML = "Estimated Travel Time: " + duration;
            }
        });
    }
    // function showTurns(response) {
    //     const allCoordinates = [];
    //     const selectedRoute = response.routes[0];
    //     const steps = response.routes[0].legs[0].steps;
   
    //     selectedRoute.legs.forEach(leg => {
    //         leg.steps.forEach(step => {
    //             step.path.forEach(point => {
    //                 allCoordinates.push({
    //                     lat: point.lat(),
    //                     lng: point.lng()
    //                 });
    //             });
    //         });
    //     });
    
    //     // Send allCoordinates to the server
    //     fetch('http://localhost:8080/sendCoordinates', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ coordinates: allCoordinates }),
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Failed to send coordinates to the server');
    //         }
    //         console.log('Coordinates sent successfully');
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
    
    //     // Displaying directions in the UI
    //     const directionsContainer = document.getElementById("directions-container");
    //     let html = "";
    //     for (let i = 0; i < steps.length; i++) {
    //         const instruction = steps[i].instructions;
    //         const distance = steps[i].distance.text;
    //         html += `<p>${instruction} (${distance})</p>`;
    //     }
        
    //     console.log(allCoordinates);
    //     directionsContainer.innerHTML = html;
       
  

    // }
    function showTurns(response) {
        const allCoordinates = [];
        const selectedRoute = response.routes[0];
        const steps = response.routes[0].legs[0].steps;
    
        selectedRoute.legs.forEach(leg => {
            leg.steps.forEach(step => {
                step.path.forEach(point => {
                    allCoordinates.push({
                        lat: point.lat(),
                        lng: point.lng()
                    });
                });
            });
        });
    
        // Send all coordinates to the server
        fetch('http://localhost:8080/sendCoordinates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ coordinates: allCoordinates }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send coordinates to the server');
            }
            console.log('Coordinates sent successfully');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
       
        const directionsContainer = document.getElementById("directions-container");
        let html = "";
        for (let i = 0; i < steps.length; i++) {
            const instruction = steps[i].maneuver; // Get the direction word
            const distance = steps[i].distance.value; // Get the distance in meters
    
            // Add the direction word and distance in meters to the HTML
            html += `<p>${instruction} (${distance} meters)</p>`;
        }
   


console.log(allCoordinates);
directionsContainer.innerHTML = html;

        console.log(allCoordinates);
        directionsContainer.innerHTML = html;
    }
    
   
   


    return (
        <>
            <h1>Car Route Finder</h1>
            <div>
                <label htmlFor="destination">Enter Destination:</label>
                <input type="text" id="destination" placeholder="Search places..." />
                <button onClick={calculateRoute}>Calculate Route</button>
            </div>
            <div id="directions-container"></div>
            <div id="travelTime"></div>
            <div id="map"></div>
           
        </>
    );
};

export default Map;
