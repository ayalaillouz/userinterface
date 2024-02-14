import { init } from "create-react-app/createReactApp";
import './StyleMap.css';
function Map()
{
    function initMap()
    {
        currentLocation = { lat: 0, lng: 0 };
        map = new google.maps.Map(document.getElementById('map'), 
        {
            center: currentLocation,
            zoom: 18
        });
        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);
  
        navigator.geolocation.getCurrentPosition(function (position) {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(currentLocation);

            var marker = new google.maps.Marker({
                position: currentLocation,
                map: map,
                title: 'Current Location'
            });
        });


    }
   
    // Initialize Google Places Autocomplete
    function initAutocomplete() {
        const searchInput = document.getElementById('destination');
        const autocomplete = new google.maps.places.Autocomplete(searchInput);
    }

    // Load Google Maps API script
    function loadScript() {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDfJ4KrjD_b0b5wKUMKZFTQU6Erac6Hq10&libraries=places&callback=initAutocomplete`;
        document.body.appendChild(script);
    }

    // Call loadScript function when the page finishes loading
    window.onload = loadScript;

    function calculateRoute() {
        var destination = document.getElementById('destination').value;

        var request = {
            origin: /*map.getCenter()*/currentLocation,
            destination: destination,
            travelMode: 'DRIVING',
   
            drivingOptions: {
            departureTime: new Date(Date.now()),
            }
        };

        directionsService.route(request, function (result, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(result);
                showTravelTime();
                const directionsRenderer = new google.maps.DirectionsRenderer();
                calculateAndDisplayRoute(directionsService, directionsRenderer, currentLocation, destination);
            }
        });



    }
    function showTravelTime() {
        var dest = document.getElementById('destination').value;

        var request = {
            origin:map.getCenter(),
            destination: dest,
            travelMode: 'DRIVING'
        };

        directionsService.route(request, function (result, status) {
            if (status == 'OK') {
                var route = result.routes[0];
                var duration = route.legs[0].duration.text;

                travelTime.innerHTML = "Estimated Travel Time: " + duration;

            }
        });
    }
    function calculateAndDisplayRoute(directionsService, directionsRenderer, start, end) {
        directionsService.route(
            {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            },
            (response, status) => {
                if (status === "OK") {
                    directionsRenderer.setDirections(response);
                    showTurns(response);
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        );
    }
    function showTurns(response)
    {
        const steps = response.routes[0].legs[0].steps;
        const directionsContainer = document.getElementById("directions-container");

        let html = "";
        for (let i = 0; i < steps.length; i++) {
            const instruction = steps[i].instructions;
            const distance = steps[i].distance.text;
            html += `<p>${instruction} (${distance})</p>`;
        }

        directionsContainer.innerHTML = html;
    }
    initMap();
return(
    <>
    <h1>Car Route Finder</h1>
    <div>
        <label for="destination">Enter Destination:</label>
        <input type="text" id="destination" placeholder="Search places..."/>
        <button onclick="calculateRoute()">Calculate Route</button>
    </div>
    <div id="directions-container"></div>
    <div id="travelTime"></div>
    <div id="map"></div>
    </>
);
};
export default routeCalculation;