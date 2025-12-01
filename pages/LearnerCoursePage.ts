import { BrowserContext, Page } from "@playwright/test";
import { CatalogPage } from "./CatalogPage";
import { FakerData } from "../utils/fakerUtils";

export class LearnerCoursePage extends CatalogPage {

    public selectors = {
        ...this.selectors,
        contentPlaySeq: `//span[contains(text(),'Content')]/following::i[contains(@class,'fa-duotone fa-circle-play pointer')]`,
        conentSeqOption: (index: number) => `//span[contains(text(),'Content')]/following::i[contains(@class,'fa-duotone fa-circle-play pointer')][${index}]`,
        warningMessage: `//div[contains(@class,'align-items-center d-flex')]//span[1]`,
        q1: `//span[text()='1. Pre']/following::i[1]`,
        submitAnswers: `(//span[text()='Submit my Answers'])[2]`,
        contentProgressStatus: `//span[text()='100%']`,
        reEnrollBtn: `//button[text()='Enroll Again']`,
        reEnrollPopUp: `//span[text()='You are attempting to retake a class of the same course that you have already completed. Would you like to proceed?']`,
        reEnrollPopUpYesBtn: `//button[text()='Yes']`,
        requestClass: `//span[text()='REQUEST CLASS']`,
        messageTOadmin: `//textarea[@id='reqclsmsg']`,
        submitButton: `//button[@id='reqcls-btn-submit']`,
        closeButton: `//div[contains(@id,'simplemodal')]//i[contains(@class,'fa-duotone fa-times icon')]`,
        reEnrolledCourses: (index: number) => `//button[text()='re-enroll']/following::span[contains(@class,'field_title')][${index}]`,
        sessionConflictPopup:`//div[contains(@class,'justify-content-center')]//span[contains(text(),'Session has conflict')]`,
        yesBtn:`//button[text()='Yes']`

    };

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    public async clickRandomcontent() {
        const videoSeq = this.selectors.contentPlaySeq
        const length = await this.page.locator(this.selectors.contentPlaySeq).count();
        const randomIndex = Math.floor(Math.random() * length) + 1;
        await this.click(this.selectors.conentSeqOption(2), "All contents", "Checkb ox")
    }

    public async clickfirstcontent() {
        const videoSeq = this.selectors.contentPlaySeq
        const length = await this.page.locator(this.selectors.contentPlaySeq).count();
        const randomIndex = Math.floor(Math.random() * length) + 1;
        await this.click(this.selectors.conentSeqOption(1), "All contents", "Checkbox")
    }

    public async clickPreAssessmentQAndA() {
        await this.click(this.selectors.q1, "Question 1", "CheckBox")
        await this.click(this.selectors.submitAnswers, "Submit Answers", "Button")
    }

    public async verifyWarningMessage() {
        const msg = await this.getInnerText(this.selectors.warningMessage)
        console.log(msg)
    }
    public async clickcontentInSequence() {
        const videoSeq = this.selectors.contentPlaySeq
        const length = await this.page.locator(this.selectors.contentPlaySeq).count();
        const randomIndex = Math.floor(Math.random() * length) + 1;
        for (let index = 2; index <= randomIndex; index++) {
            await this.click(this.selectors.conentSeqOption(index), "All contents", "Checkbox")
            await this.waitSelector(this.selectors.contentProgressStatus)
        }
    }

    async clickReEnroll() {
        await this.wait("minWait")
        await this.click(this.selectors.reEnrollBtn, "ReEnroll", "Button");
    }

    async verifyEnrollAgainNotVisible() {
        await this.wait("minWait")
        const enrollAgainBtn = this.page.locator(this.selectors.reEnrollBtn);
        const isVisible = await enrollAgainBtn.isVisible();
        if (isVisible) {
            throw new Error("Enroll Again button should not be visible when the checkbox is unchecked");
        }
        console.log("✅ Enroll Again button is not visible as expected");
    }

    async verifyRequestClass() {
        await this.validateElementVisibility(this.selectors.requestClass, "Request Class")
    }

    async clickRequestClass() {
        await this.click(this.selectors.requestClass, "Request Class", "Option")
        await this.validateElementVisibility(this.selectors.messageTOadmin, "Submit")
        await this.keyboardType(this.selectors.messageTOadmin, FakerData.getDescription())
        await this.click(this.selectors.submitButton, "Submit", "Button")
        await this.click(this.selectors.closeButton, "close", "Button")

    }


    async reEnrolledcourseCount() {
        const count = await this.page.locator("//button[text()='re-enroll']/following::span[contains(@class,'field_title')]").count()
        for (let i = 1; i <= count; i++) {
            return await this.getInnerText(this.selectors.reEnrolledCourses(i))
        }
    }
    async reEnrollPopup(){
        await this.wait("minWait")
        await this.validateElementVisibility(this.selectors.reEnrollPopUp, "ReEnroll Popup Message");
        await this.verification(this.selectors.reEnrollPopUp, "You are attempting to retake a class of the same course that you have already completed. Would you like to proceed?");
        await this.click(this.selectors.reEnrollPopUpYesBtn, "Yes", "Button");
        await this.wait("maxWait")
    }
}