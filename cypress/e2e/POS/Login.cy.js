const baseUrlUser = Cypress.config("baseUrlUser")
const urlUser = baseUrlUser + '/employee/login'
const nik = "13152"
const storeCode = "14216"
const pin = "1234"
var empToken = null
var cardNumber = null
var cusFirstName = null
var cusLastName = null
var cusPhoneNumber = null
var cusEmail = null

describe('Login and Open Shift', () => {
    it("Should get access token", () => {
        const requestBody={
            nik: nik,
            storeCode: storeCode,
            pin: pin
        }
        cy.request({
            method: "POST",
            url: urlUser,
            body: requestBody
        })
        .should(response => {
            expect(response.status).to.equal(201)
            expect(response.body.statusCode).to.equal(201)
            const data = response.body.data
            expect(data).to.haveOwnProperty("accessToken")
            expect(response.body.data.accessToken).to.not.be.empty
            empToken = response.body.data.accessToken
        })
    })

    it("Should able to close shift", () => {
        cy.request({
            method: "POST",
            url: baseUrlUser + '/employee/shift/close',
            headers: { 
                'Authorization': 'Bearer ' + empToken 
            },
            failOnStatusCode: false
        })
        .should(response => {
            // expect(response.status).to.equal(400)
            
        })
    })

    it("Should able to open shift", () => {
        cy.request({
            method: "POST",
            url: baseUrlUser + '/employee/shift/open',
            headers: { 
                'Authorization': 'Bearer ' + empToken 
            },
            failOnStatusCode: false
        })
        .should(response => {
            expect(response.status).to.equal(201)
            expect(response.body.statusCode).to.equal(201)
            expect(response.body.data.code).to.not.be.empty
            expect(response.body.data.status).to.eql("open")
        })
    })

    it("Should able to search customer by name", () => {
        cy.request({
            method: "POST",
            url: baseUrlUser + '/employee/search-member-v2',
            headers: { 
                'Authorization': 'Bearer ' + empToken 
            },
            failOnStatusCode: false,
            body: {
                firstName: "BE Automation",
                lastName: ""
            }
        })
        .should(response => {
            expect(response.status).to.equal(201)
            expect(response.body.statusCode).to.equal(201)
            response.body.data.forEach(function(cus) {
                let nama = cus.firstName.toLowerCase();
                expect(nama).to.include("be automation");
            });
        })
    })

    it("Should able to search customer by phone number", () => {
        cy.request({
            method: "POST",
            url: baseUrlUser + '/employee/search-member-v2',
            headers: { 
                'Authorization': 'Bearer ' + empToken 
            },
            failOnStatusCode: false,
            body: {
                phoneNumber: "6280000001111"
            }
        })
        .should(response => {
            expect(response.status).to.equal(201)
            expect(response.body.statusCode).to.equal(201)
            response.body.data.forEach(function(cus) {
                let phoneNumber = cus.phoneNumber;
                expect(phoneNumber).to.eql("6280000001111");                
            });
        })
    })

    it("Should able to search customer by email", () => {
        cy.request({
            method: "POST",
            url: baseUrlUser + '/employee/search-member-v2',
            headers: { 
                'Authorization': 'Bearer ' + empToken 
            },
            failOnStatusCode: false,
            body: {
                email: "testerautobe-auto@mailinator.com"
            }
        })
        .should(response => {
            expect(response.status).to.equal(201)
            expect(response.body.statusCode).to.equal(201)
            response.body.data.forEach(function(cus) {
                let email = cus.email;
                expect(email).to.eql("testerautobe-auto@mailinator.com");                
                cardNumber = cus.cardNumber;
            });
        })
    })

    it("Should able to search customer by card number", () => {
        cy.request({
            method: "POST",
            url: baseUrlUser + '/employee/search-member-v2',
            headers: { 
                'Authorization': 'Bearer ' + empToken 
            },
            failOnStatusCode: false,
            body: {
                cardNumber: cardNumber
            }
        })
        .should(response => {
            expect(response.status).to.equal(201)
            expect(response.body.statusCode).to.equal(201)
            response.body.data.forEach(function(cus) {
                let cardnumber = cus.cardNumber;
                expect(cardnumber).to.eql(cardNumber);                
            });
        })
    })

    it("Verify customer detail", () => {
        cy.request({
            method: "POST",
            url: baseUrlUser + '/employee/detail-member?cardNumber='+cardNumber,
            headers: { 
                'Authorization': 'Bearer ' + empToken 
            },
            failOnStatusCode: false
        })
        .should(response => {
            expect(response.status).to.equal(201)
            expect(response.body.statusCode).to.equal(201)
            const body = response.body
            expect(body.message).to.equal("Success")
            expect(body).to.haveOwnProperty("data")
        })
        .should(response => {
            const data = response.body.data
            expect(data).to.haveOwnProperty("_id")
            expect(data).to.haveOwnProperty("phoneNumber")
            expect(data).to.haveOwnProperty("email")
            expect(data).to.haveOwnProperty("firstName")
            expect(data).to.haveOwnProperty("lastName")
            expect(data).to.haveOwnProperty("cardNumber")
            expect(data).to.haveOwnProperty("gender")
            expect(data).to.haveOwnProperty("cardTypeDescription")
            expect(data).to.haveOwnProperty("nik")
            expect(data).to.haveOwnProperty("isFamily")
            expect(data).to.haveOwnProperty("currentTier")
            expect(data).to.haveOwnProperty("memberSince")
            expect(data).to.haveOwnProperty("currentPoint")
            expect(data).to.haveOwnProperty("totalExpirationPoints")
            expect(data).to.haveOwnProperty("expirations")
            expect(data).to.haveOwnProperty("lastPurchaseAmount")
            expect(data).to.haveOwnProperty("birthdayStatus")
            expect(data).to.haveOwnProperty("isReactivated")
            expect(data).to.haveOwnProperty("isLapsed")
            expect(data).to.haveOwnProperty("isIcarusAppUser")
            expect(data).to.haveOwnProperty("autoEnroll")
            expect(data).to.haveOwnProperty("autoEnrollFrom")
            cusFirstName = data.firstName;
            cusLastName = data.lastName;
            cusPhoneNumber = data.phoneNumber;
            cusEmail = data.email;
        })
    })



})