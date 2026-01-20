import { time } from "console";
import { FakerData, getcardExpiryDate, getCreditCardNumber, getCVV, getPonumber, getRandomLocation } from "../utils/fakerUtils";
import { LearnerHomePage } from "./LearnerHomePage";
import { URLConstants } from "../constants/urlConstants";

export class CostcenterPage extends LearnerHomePage {
    public selectors = {
        ...this.selectors,
        orderSummaryLabel: "//div[text()='order summary']",
        okButton: `//p[text()='Add to cart']/following::button[text()='Ok']`,
        supportOkButton:`//button[text()='Ok']`,
        firstName: `//label[text()='First Name']/following-sibling::input`,
        lastName: `//label[text()='Last Name']/following-sibling::input`,
        savedAddress:`(//label[text()='Saved Address']/following::button)[1]`,
        searchAddress:`//footer/following::input`,
        selectAddress:(addressName:string)=>`//li//span[text()='${addressName}']`,
        address: `//label[text()='Address1']/following-sibling::input`,
        countrySelect: `//label[text()='Country']/following::button[@data-id='country']`,
        ddOption: `//div[@class='dropdown-menu show']//input[@aria-label='Search']`,
        countryName: (countryName: string) => `//span[text()= '${countryName}']`,
        stateField: `//div[@id='wrapper-state']//button[@data-id='state']`,
        cityTown: `//label[text()='City/Town']/following-sibling::input`,
        zipcode: `//label[text()='Zip Code']/following-sibling::input`,
        paymentMode: `//div[@id='wrapper-payment_mode']`,
        paymentOption: (option: number) => `(//div[@id='wrapper-payment_mode']/following::ul//a)[${option}]`,
        paymentMethod: (option: string) => `//span[text()='${option}']`,
        cardNumber: `//label[text()='Card Number']/following-sibling::input`,
        expiryDate: `//label[text()='Expiration Date']/following-sibling::input`,
        cvvNumber: `(//span[text()='cvv']/following::input)[1]`,
        poNumber: `//label[text()='PO number:']/following-sibling::input`,
        termsAndCondition: `//label[text()=' I agree to the ']/i[2]`,
        checkOut: `//button[text()='check out']`,
        chkOutAddress: `//label[text()='Address Name']/following::div/input`,
        createButton: `//button[text()='create']`,
        successMsg: `//h3[contains(text(),' Thank you for your order')]`,
        costCenterInput: "//label[text()='Cost center:']//following-sibling::input",
        addressYouEnteredPopup:"//p[contains(text(),'The address you entered has not been created.')]",
        // :"//label[text()='City/Town']//parent::div//input"
        paymentMethodValue: "//label[text()='Payment Method']/parent::div//div[@class='filter-option-inner-inner']",
        paymentMethodInput:"//label[text()='PO number:']//following-sibling::input",
    };

    public async orderSummaryLabelVerify() {
        await this.spinnerDisappear();
        await this.validateElementVisibility(this.selectors.orderSummaryLabel, "Order Summary");
    }

    public async clickOktoorder() {
        await this.click(this.selectors.okButton, "OK ", "Button")
    }

    public async billingDetails(countryName: string,cityName:string) {
        await this.type(this.selectors.address, "Address", FakerData.getAddress())
        await this.click(this.selectors.countrySelect, "Country", "Dropdown")
        await this.type(this.selectors.ddOption, "Country", countryName)
        await this.mouseHover(this.selectors.countryName(countryName), "Country")
        await this.click(this.selectors.countryName(countryName), "Country", "Option")
        await this.click(this.selectors.stateField, "state", "Dropdown")
        await this.type(this.selectors.ddOption, "state", cityName);
        await this.mouseHover(this.selectors.countryName(cityName), "City/Town");
        await this.click(this.selectors.countryName(cityName), "city/Town", "Option");
        await this.type(this.selectors.cityTown, "CityTown", FakerData.randomCityName());
        await this.type(this.selectors.zipcode, "Zipcode", getPonumber())
        await this.type("//label[text()='first name']//following::input[1]", "First Name", FakerData.getFirstName())
        await this.type("//label[text()='last name']//following::input[1]", "Last Name", FakerData.getLastName())

    }
    async calculateTax(){
        await this.wait("mediumWait")
        await this.validateElementVisibility("//button[text()='Calculate Tax']", "Calculate Tax Button")
        await this.click("//button[text()='Calculate Tax']","Calculate Tax","Button")
        await this.wait("mediumWait")
    }

    async orderApproval(){
try {
    await this.validateElementVisibility("//label[text()='Cost center:']//following::input[1]", "Cost Center Input")
    await this.type("//label[text()='Cost center:']//following::input[1]", "name", "12")
    await this.wait("minWait")
} catch {
    console.log("Cost center is not there")
}
await this.click("//label[@for='tCChecked']//preceding::i[contains(@class,'fad fa-square icon')]","Terms and Condition","Checkbox")
await this.wait("minWait")
await this.click("//button[text()='create order & approve']","Create Order & Approve","Button")
await this.wait("minWait")
}

   

    public async paymentMethod(payMode: string) {
        await this.validateElementVisibility(this.selectors.paymentMode, "Payment mode")
        await this.click(this.selectors.paymentMode, "Payment Mode", "Field")
        await this.click(this.selectors.paymentMethod(payMode), "Payment Mode", "Option")
    }

    public async fillCostCenterInput(){
        await this.type(this.selectors.costCenterInput,"Input","67675545546");
    }
    // public async fillCreditDetails() {
    //     await this.type(this.selectors.cardNumber, "Card Number", getCreditCardNumber())
    //     await this.type(this.selectors.expiryDate, "Expiry Date", getcardExpiryDate())
    //     await this.type(this.selectors.cvvNumber, "CVV number", getCVV())
    // }

    public async enterPOnumber() {
        await this.type(this.selectors.poNumber, "PO Number", getPonumber())
    }

    public async clickTermsandCondition() {
        await this.click(this.selectors.termsAndCondition, "TermsandCondition", "Checkbox");
    }

    public async selectSavedAddressDropdown(address:string){
        await this.click(this.selectors.savedAddress,"Address","Dropdown")
        await this.type(this.selectors.searchAddress,"Address",address)
        await this.click(this.selectors.selectAddress(address),"Saved Address","Dropdown")
    }


    public async clickCheckout(address:string) {
        await this.validateElementVisibility(this.selectors.checkOut, "checkout",);
        await this.click(this.selectors.checkOut, "checkout", "button");
        await this.wait('mediumWait');
        const popup = this.page.locator(this.selectors.addressYouEnteredPopup);
        if(await popup.isVisible()){
            await this.type(this.selectors.chkOutAddress,"Address Name",FakerData.addressName());
            await this.click(this.selectors.createButton,"Create","Button");
            await this.click(this.selectors.createButton, "Create", "button");
        }else{
            await this.click(this.selectors.supportOkButton,"ContactSupport"," OK Button")
        }
      //  await this.page.pause();
    }


    public async verifySuccessMsg() {
        await this.validateElementVisibility(this.selectors.successMsg, "toastMessage")
        await this.verification(this.selectors.successMsg, "thank you")
    }

    public async fillPaymentMethodInput(){
        await this.type(this.selectors.paymentMethodInput,"Input","67675545546");
    }
	
    
	  public async fillCreditDetails() {
	  
	  //Existing step
        // await this.type(this.selectors.cardNumber, "Card Number", getCreditCardNumber())
        // await this.type(this.selectors.expiryDate, "Expiry Date", getcardExpiryDate())
        // await this.type(this.selectors.cvvNumber, "CVV number", getCVV())
     
	  //New step, retriving default credit card details from URLConstants page
        await this.type(this.selectors.cardNumber, "Card Number", URLConstants.creditCardNumber)
        await this.type(this.selectors.expiryDate, "Expiry Date", URLConstants.cardExpiryDate)
        await this.type(this.selectors.cvvNumber, "CVV number", URLConstants.cVV)
    }

}