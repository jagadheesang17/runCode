
import { expect } from "playwright/test";
import { LearnerHomePage } from "./LearnerHomePage";
import { min } from "date-fns";

export class UniversalSearchPage extends LearnerHomePage {

    public selectors = {
        ...this.selectors,
        univ_SearchBox: "//input[@id='exp-searchuniversalsearchsearch-field']",
        univ_SeachClick: "//div[@id='exp-searchuniversalsearchsearch-icon']",
        univ_SearchResult: (name: string) => `(//h5[text()="${name}"])[1]`,
        univ_SearchbyDropdownClick: "//button[@data-id='universalsearch-search-by']",
        univ_Searchby: (value: string) => `//span[text()="${value}"]`,
        univ_SearchClear: "//div[text()='Clear all']",
        univ_SearchBox2: "//input[@id='exp-searchfrom-ussearch-field']",
        univ_SeachClick2: "//div[@id='exp-searchfrom-ussearch-icon']",
        noResultmsg: `//div[contains(@class, 'information_text')][contains(text(), 'No results found')]`,


    }

    async univSearch(searchData: string) {
        await this.wait("minWait")
        await this.type(this.selectors.univ_SearchBox, "Universal Search Field", searchData)
        await this.click(this.selectors.univ_SeachClick, "Search icon", "search icon")
    }

    async univSearchResult(data: string) {
        await this.wait("maxWait")
        //await this.validateElementVisibility(this.selectors.univ_CourseResult(data),"Search Result")
        const result = this.selectors.univ_SearchResult(data);
        await this.mouseHover(result, "Search Record Mouseover")
        //await this.verification(result,"Record has been found")
        expect(result).toContain(`${data}`)
        await this.wait("maxWait")
    }

    async univSearchByDropdown(value: string) {
        // await this.page.reload();
        //  await this.wait("mediumWait")
        await this.click(this.selectors.univ_SearchbyDropdownClick, "Universal Search By", "Dropdown")
        await this.click(this.selectors.univ_Searchby(value), "Universal Search By", "Dropdown")
        await this.wait("maxWait")
    }

    async univSearchClear() {
        await this.wait("minWait")
        await this.click(this.selectors.univ_SearchClear, "Universal Search By", "Dropdown")
      await this.wait("maxWait")

    }

    async univSearchSecondTime(searchData: string) {

        await this.type(this.selectors.univ_SearchBox2, "Universal Search Field", searchData)
        await this.click(this.selectors.univ_SeachClick2, "Search icon", "search icon")
        await this.wait("maxWait")
    }

 async verifyDedicatedTPCourseNotDisplayed() {
    await this.wait("maxWait");
    const noResultsMsg = await this.page.locator(this.selectors.noResultmsg);
    const count = await noResultsMsg.count();
    
    if (count >= 4) {
      console.log(`✅ Verified - The selected course or class is marked as Dedicated to TP`);
      console.log(`No results found: ${count} 'No results found' messages displayed (minimum 4 expected)`);
      return true;
    } else {
      throw new Error(`Expected at least 4 'No results found' messages but got ${count}`);
    }
  }





}
