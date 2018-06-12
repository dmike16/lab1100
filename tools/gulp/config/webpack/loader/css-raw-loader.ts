export default function(content: string, map: object) {
    const cssString = JSON.stringify(content);
    const mapString = map && JSON.stringify(map);

    return `module.exports = [[module.id, ${cssString}, ' ', ${mapString}]]`;
}
