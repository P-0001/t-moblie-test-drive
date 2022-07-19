// cspell:disable
const street = [
    "Street",
    "St",
    "Stret",
    "Steet",
    "Strt",
    "treet",
    "Str",
    "Sreet",
    "Srtet",
    "Srteet",
    "Steert",
    "Stree",
    "Strett"
],
    road = [
        "Road",
        "Rd",
        "Rod",
        "Rad",
        "Roa",
        "Raod",
        "Roda",
        "Rooad",
        "Roaad",
        "Roadd"
    ],
    place = [
        "Place",
        "Pl",
        "Plce",
        "Plac",
        "Plae",
        "Pla",
        "PPlace",
        "Pace",
        "Plaace",
        "Pllace"
    ],
    avenue = [
        "Avenue",
        "Ave",
        "Av",
        "Avn",
        "Avene",
        "Avenu",
        "Aven",
        "Avnue",
        "Avne",
        "Aveneu"
    ],
    drive = [
        "Drive",
        "Dr",
        "Driv",
        "Drv",
        "Drve",
        "Driive",
        "Dive",
        "Ddrive",
        "Drivee",
        "Drrive"
    ],
    court = [
        "Court",
        "Crt",
        "Cort",
        "Cuort",
        "Curt",
        "Ct",
        "Courrt",
        "Coouurt",
        "Cuourt",
        "Cout"
    ],
    lane = [
        "Lane",
        "Lne",
        "Lnae",
        "Ln",
        "Lena",
        "Lanne",
        "Laane",
        "Lanee",
        "Llane",
        "Lan"
    ],
    way = ["Way", "Waay", "Wy", "Wayy", "Wway"];

export const Street = () => {
    return randomArrElement(street);
};

export const Road = () => {
    return randomArrElement(road);
};

export const Place = () => {
    return randomArrElement(place);
};

export const Avenue = () => {
    return randomArrElement(avenue);
};

export const Drive = () => {
    return randomArrElement(drive);
};

export const Court = () => {
    return randomArrElement(court);
};

export const Lane = () => {
    return randomArrElement(lane);
};

export const Way = () => {
    return randomArrElement(way);
};

let randomArrElement = (arr: Array<string>) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const obj = {
    way,
    lane,
    street,
    road,
    place,
    avenue,
    drive,
    court
}

const find = (address: string) => {
    let normal = address.toLowerCase()

    for (let name in obj) {
        let all: Array<string> = obj[name]
        all.forEach(s => {
            let word = s.toLowerCase()
            if (normal.includes(word.toLowerCase())) {
                normal = normal.replace(word, randomArrElement(all))
            };
        })
    };

    return normal
}

export default find