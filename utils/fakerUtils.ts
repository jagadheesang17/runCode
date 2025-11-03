import { faker } from "@faker-js/faker";
import path from "path";
import fs from 'fs'
import { filePath } from "../data/MetadataLibraryData/filePathEnv";



export class FakerData {

    static OrganizationName(): string {
        let org = `${faker.person.jobTitle()}${" Organization"}`
        return org
    }
    static getFirstName(): string {
        return faker.person.firstName();
    }
    static getLastName(): string {
        return faker.person.lastName();
    }
    static getOrganizationName() {
        return capitalizeFirstLetter(faker.company.buzzNoun())
    }
    static getcurrentYear() {
        return `${faker.date.anytime().getFullYear() - 2}`;
    }

    static getMobileNumber(): string {
        return getPhoneNumber();
    }

    static getEmail(): string {
        return faker.internet.email();
    }
    static getAddress(): string {
        return faker.location.streetAddress();
    }

    static getPinCode() {
        return faker.location.zipCode('######');
    }

    static addressName(): string {
        return `${faker.location.countryCode()} ${faker.location.county()}`;
    }

    static getAwardName() {
        const awardName = faker.helpers.arrayElement(["Excellency Award", "Leadership Award", "Trailblazer Award", "Pioneer Award"])
        return awardName
    }

    static jobRole(): string {
        return faker.person.jobTitle()+faker.number.int({min:1,max:3})
    }

    static equipmentName(): string {
        return faker.commerce.productMaterial();
    }
    static getTagNames() {
        const techTerm = faker.hacker.noun();
        return techTerm;
    }
    static getLocationName() {
        const location = faker.location.street();
        return location;
    }
    static getcertificationTitle() {
        const title = faker.word.sample() + " " + faker.word.noun()
        return title;
    }

    static AssessmentTitle() {
        const assmtTitle = (faker.word.noun() + " " + faker.word.verb() + " " + faker.word.sample());
        return assmtTitle;

    }
    
    static generateQuestion() {
        const question = (faker.lorem.sentence({ min: 4, max: 5 }) + "").replace(/\./g, '');
        return question
    }
    static getCourseName(): string {
        const adjective = faker.hacker.adjective();
        const noun = faker.hacker.noun();
        const verb = faker.hacker.verb();
        return `${capitalizeFirstLetter(adjective)} ${capitalizeFirstLetter(noun)} ${capitalizeFirstLetter(verb)}`;
    }
    static getUserId(): string {
        //const currentDate = new Date();
        //const milliseconds = currentDate.getTime().toString();
        const fName = faker.person.firstName();
        const user = faker.internet.email({ firstName: fName })
        return user;
    }
    static getEmployeeid(): string {
        const employeeId = faker.string.numeric({ length: 4 });
        const formattedEmployeeId = `EMP-${employeeId}`;

        return formattedEmployeeId;
    }
    static getCertificationNumber(): string {
        const employeeId = faker.string.numeric({ length: 4 });
        const formattedEmployeeId = `CER-${employeeId}`;

        return formattedEmployeeId;
    }
    static getRandomSkill(): string {
        return faker.hacker.adjective();
    }
    static randomCityName(): string {
        return faker.person.jobArea();
    }
    static getSession(): string {
        const session = faker.person.jobDescriptor()
        return session
    }

    static getDuration() {
        return faker.date.future().getHours().toString();
    }

    static getDescription(): string {
        const description = faker.lorem.paragraph(1);
        return description;
    }
    static getCategory(): string {
        const category = capitalizeFirstLetter(faker.company.buzzVerb()) + " " + capitalizeFirstLetter(faker.company.buzzNoun())
        return category;
    }
    static getMaxseats() {
        return faker.number.int({ min: 20 })
    }

    static getPrice(): string {
        return faker.commerce.price()
    }

    static getQualification() {
        const qualification = {
            degree: faker.helpers.arrayElement(['Bachelor', 'Master', 'PhD', 'Certificate', 'Diploma']),
            fieldOfStudy: faker.helpers.arrayElement(['Computer Science', 'Engineering', 'Business', 'Arts', 'Science']),
            institution: faker.company.name(),
            graduationDate: faker.date.past(10).toLocaleDateString(),
            grade: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
        };

        return qualification;

    }



    static getMeetingUrl(): string {
        return faker.internet.url();

    }
    static getRandomTitle() {
        return (capitalizeFirstLetter(faker.hacker.noun()) + " " + capitalizeFirstLetter(faker.hacker.noun()));
    }

    // Missing methods for metadata library
    static getDepartmentName(): string {
        return capitalizeFirstLetter(faker.commerce.department());
    }

    static getCEUProviderName(): string {
        return `${capitalizeFirstLetter(faker.company.buzzNoun())} CEU Provider`;
    }

    static getProviderName(): string {
        return `${capitalizeFirstLetter(faker.company.buzzAdjective())} ${capitalizeFirstLetter(faker.company.buzzNoun())} Provider`;
    }

    static getUserTypeName(): string {
        return `${capitalizeFirstLetter(faker.person.jobDescriptor())} User`;
    }

    static getJobRoleName(): string {
        return faker.person.jobTitle();
    }

    static getEquipmentName(): string {
        return faker.commerce.productMaterial();
    }
}

export function getCreditCardNumber(): string {
    // const startDigit = Math.floor(Math.random() * 3) + 7;
    // const restDigits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
    // return `${startDigit}${restDigits}`;
    return faker.finance.creditCardNumber();
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



function getPhoneNumber(): string {
    const startDigit = Math.floor(Math.random() * 3) + 7;
    const restDigits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
    return `${startDigit}${restDigits}`;

}
export function getCVV(): string {
    // const startDigit = Math.floor(Math.random() * 1) + 12;
    // const restDigits = Array.from({ length: 1 }, () => Math.floor(Math.random() * 10)).join('');
    // return `${startDigit}${restDigits}`;
    return faker.finance.creditCardCVV()
}

export function score() {
    const min = 50;
    const max = 100;
    const step = 5;
    const range = Math.floor((max - min) / step) + 1;
    const randomMultiple = Math.floor(Math.random() * range) * step + min;
    return randomMultiple.toString();

}

export function generateCreditScore(): number {
    // Credit scores typically range from 300 to 850
    const minCreditScore = 300;
    const maxCreditScore = 850;
    return faker.number.int({ min: minCreditScore, max: maxCreditScore });
}

export async function getRandomSeat() {
    const num = 100;
    const randomNumber = Math.floor(Math.random() * num) + 1;
    return randomNumber.toString();
}

type DataItem = string;
export function getRandomLocation(): DataItem | any {
    const file=filePath.location
    try {
        
        const filePath = path.join(__dirname, file);
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const dataArray: DataItem[] = JSON.parse(jsonData);
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error('Data array is empty or not an array');
        }
        const randomIndex = Math.floor(Math.random() * dataArray.length);
        const randomValue = dataArray[randomIndex];
        return randomValue;
    } catch (error) {
        console.error('Error in getRandomDataItem:', error.message);
        return null;
    }
}
export function gettomorrowDateFormatted(): string {
    const date = new Date();
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate() + 1);
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

export function getCurrentDateFormatted(): string {
    const date = new Date();
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}


export function getRandomFutureDate(): string {
    const date = faker.date.future(1); // adjust range if needed
    return `${String(date.getMonth() + 1).padStart(2, '0')}/` +
           `${String(date.getDate()).padStart(2, '0')}/` +
           `${date.getFullYear()}`;
}

export function getPastDate(): string {

    const date = new Date();
    date.setDate(date.getDate() - 5);
    date.setMonth(date.getMonth() - 2);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear() - 4);
    return `${month}/${day}/${year}`;
}

export function getFutureDate(): string {

    const date = new Date();
    date.setDate(date.getDate() + 3);
    date.setMonth(date.getMonth() + 7);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear() + 3);
    return `${month}/${day}/${year}`;
}



export function getFutureyear(): string {
    const date = new Date();
    date.setDate(date.getDate() - 2);
    date.setMonth(date.getMonth() - 2);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear() + 4);
    return `${month}/${day}/${year}`;
}


export function getnextMonthFormatted(): string {
    const date = new Date();
    const month = String(date.getMonth() + 2) // getMonth() is zero-based
    const day = String(date.getDate() + 2)
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

export function getcardExpiryDate(): string {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0")// getMonth() is zero-based
    const year = date.getFullYear()
    const yy = year.toString().slice(2)
    return `${month}/${yy}`
}
export function getPonumber(): string {
    const startDigit = Math.floor(Math.random() * 3) + 12;
    const restDigits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    return `${startDigit}${restDigits}`;
}

export function getCCnumber(): string {
    const startDigit = Math.floor(Math.random() * 3) + 10;
    const restDigits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    return `${startDigit}${restDigits}`;
}

type DataItem1= string;
export function  getallRandomLocation(): DataItem1| any {
    try {
        const filePath = path.join(__dirname, '../data/allLocation.json');
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const dataArray: DataItem1[] = JSON.parse(jsonData);
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error('Data array is empty or not an array');
        }
        const randomIndex = Math.floor(Math.random() * dataArray.length);
        const randomValue = dataArray[randomIndex];
        return randomValue;
    } catch (error) {
        console.error('Error in getRandomDataItem:', error.message);
        return null;
    }
}

type DataItem2= string;
export function  getallRandomInstructor(): DataItem1| any {
    try {
        const filePath = path.join(__dirname, '../data/captureInstructor.json');
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const dataArray: DataItem2[] = JSON.parse(jsonData);
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error('Data array is empty or not an array');
        }
        const randomIndex = Math.floor(Math.random() * dataArray.length);
        const randomValue = dataArray[randomIndex];
        return randomValue;
    } catch (error) {
        console.error('Error in getRandomDataItem:', error.message);
        return null;
    }
}
type insData = string;
export function getRandomIns(): insData | any {
    const filePath = path.join(__dirname, '../data/instanceNames.json');
    try {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const dataArray: insData[] = JSON.parse(jsonData);
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error('Data array is empty or not an array');
        }
        const randomIndex = Math.floor(Math.random() * dataArray.length);
        const randomValue = dataArray[randomIndex];
        return randomValue;
    } catch (error) {
        console.error('Error in getRandomINS:', error.message);
        return null;
    }
}