// DOM Inspector Helper Script
// Run this in browser console on the Learner Group page to capture actual selectors

function captureSelectors() {
    const selectors = {};
    
    // Capture common button selectors
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn, index) => {
        const text = btn.textContent.trim();
        if (text.includes('CREATE GROUP')) {
            console.log(`createGroupBtn: "${getXPath(btn)}"`);
        }
        if (text.includes('Save')) {
            console.log(`saveButton: "${getXPath(btn)}"`);
        }
        if (text.includes('Export')) {
            console.log(`exportButton: "${getXPath(btn)}"`);
        }
    });
    
    // Capture input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
        if (input.placeholder) {
            console.log(`${input.placeholder.replace(/\s+/g, '')}Input: "${getXPath(input)}"`);
        }
        if (input.id) {
            console.log(`${input.id}Input: "${getXPath(input)}"`);
        }
    });
    
    // Capture labels and associated elements
    const labels = document.querySelectorAll('label');
    labels.forEach((label, index) => {
        const text = label.textContent.trim();
        if (text.includes('Department') || text.includes('Role') || text.includes('Country')) {
            console.log(`${text.replace(/\s+/g, '')}Label: "${getXPath(label)}"`);
            
            // Find associated input/select/dropdown
            const nextElement = label.nextElementSibling;
            if (nextElement) {
                console.log(`${text.replace(/\s+/g, '')}Field: "${getXPath(nextElement)}"`);
            }
        }
    });
    
    // Capture dropdown/select elements
    const selects = document.querySelectorAll('select, .dropdown-toggle, [class*="dropdown"]');
    selects.forEach((select, index) => {
        console.log(`dropdown${index}: "${getXPath(select)}"`);
    });
}

function getXPath(element) {
    if (element.id !== '') {
        return `//*[@id="${element.id}"]`;
    }
    if (element === document.body) {
        return '/html/body';
    }
    
    let ix = 0;
    const siblings = element.parentNode?.childNodes || [];
    for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling === element) {
            return `${getXPath(element.parentNode)}/${element.tagName.toLowerCase()}[${ix + 1}]`;
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

// Run the function
captureSelectors();