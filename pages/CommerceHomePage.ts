import { BrowserContext, Page } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import { URLConstants } from "../constants/urlConstants";


export class CommerceHomePage extends AdminHomePage{
    static pageUrl = URLConstants.adminURL;
    public selectors = {
        ...this.selectors,
             orderLink:`//a[text()='Order']`,
             approveOrder:`(//i[@aria-label='Approve Payment'])[1]`,
             yesBtn:`//button[text()='Yes']`,
             successMsg:"//span[text()='Payment of the order has been confirmed successfully']",
             okBtn:"//button[text()='OK']",

                      //For runtime passing commerce options
             commerceOptions:(option:string)=>`//a[text()='${option}']`,
             
        };

    
    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    
   public async clickOrder(){
        this.click(this.selectors.orderLink,"Order","Link")
    }

    
   public async approveOrder(){
      await this.validateElementVisibility(this.selectors.approveOrder,"Approve Order");
      await this.wait('mediumWait');
      await this.click(this.selectors.approveOrder,"Approve Order","Tick");
      await this.wait('mediumWait');
      await this.click(this.selectors.yesBtn,"Yes","Buttton");
   }

   public async verifySuccessMessage(){
    await this.verification(this.selectors.successMsg,"confirmed successfully");
    await this.click(this.selectors.okBtn,"OK","Button");
   }

  //For runtime passing commerce options
    async clickCommerceOption(data:string){
        await this.click(this.selectors.commerceOptions(data),"Commerce Option","Link");
    }






}

