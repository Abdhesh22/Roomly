const { State, City } = require('country-state-city');

const formatStateValue = (name) => {
    return name.toLowerCase().replace(/\s+/g, "_");
};

const getStates = () => {
    let states = State.getStatesOfCountry("IN");
    states = states.map((state) => {
        return {
            name: state.name,
            value: formatStateValue(state.name),
            code: state.isoCode,
            label: state.name,
            countyCode: state.countryCode
        }
    })
    console.log('states: ', states);
}

const getCities = () => {
    let cities = [];
    const states = State.getStatesOfCountry("IN");

    for (let index = 0; index < states.length; index++) {
        const state = states[index];
        const stateCities = City.getCitiesOfState("IN", state.isoCode);
        cities = [...cities, ...stateCities];
    }

    cities = cities.map((city) => ({
        name: city.name,
        value: formatStateValue(city.name),
        label: city.name,
        stateCode: city.stateCode,
    }));

    console.log("[");
    for (let index = 0; index < cities.length; index++) {
        const element = cities[index];
        console.log(element, ",");
    }
    console.log("]");
};


// getStates();
// getCities();