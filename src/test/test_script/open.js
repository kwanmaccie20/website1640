
describe('API command', ()=>{
    it('Open page', async () => {
        await browser.url('https://google.com');
        // await $('input[name="uname"]').setValue("Automation test");
        await browser.pause(3000);
    });

});