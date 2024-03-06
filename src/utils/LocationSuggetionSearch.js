export const locationSuggetionSearch = async (map, query) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};
