
describe('API command', ()=>{
    it('Open page', async () => {
        await browser.url('http://127.0.0.1:5173/');
        await $('input[name="uname"]').setValue("Automation test");
        await browser.pause(3000);
    });

});