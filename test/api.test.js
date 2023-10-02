const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app/src/server'); // Import your server.js correctly
const expect = chai.expect;

chai.use(chaiHttp);

describe('All API', () => {


  describe('POST /api/v1/registration', () => {
    it('should handle user registration', (done) => {
      chai.request(app)
        .post('/api/v1/registration')
        .send({
          author_pseudonym: "test_author_pseudonym_13",
          username: "test_username_13",
          email_address: "testuser13@gmail.com",
          password: "1",
          confirmPassword: "1"
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.is.equal('An error occurred!!');
          } else {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message').equal('User registered successfully');
          }

          done();
        });
    });
  });


  describe('POST /api/v1/login', () => {
    it('should handle user login', (done) => {
      chai.request(app)
        .post('/api/v1/login')
        .send({
          username: "username_01",
          password: "1",
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.is.equal('An error occurred!!');
          } else {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').equal('Login Success');
          }

          done();
        });
    });
  });


  // describe('POST /api/v1/book', () => {
  //   it('should handle create book', (done) => {
  //     chai.request(app)
  //       .post('/api/v1/book')
  //       .send({
  //           title: "title_12",
  //           description: "description_12",
  //           cover_image_url: "cover_image_url_12",
  //           price: "1007",
  //           user_uuid: "03180a02-c596-4819-99ec-44a72f5b2d7a"
  //       })
  //       .end((err, res) => {
  //         if (err) {
  //           expect(res).to.have.status(500);
  //           expect(res.body).to.have.property('message').that.is.equal('An error occurred!!');
  //         } else {
  //           expect(res).to.have.status(200);
  //           expect(res.body).to.have.property('message').equal('Book published successfully');
  //         }

  //         done();
  //       });
  //   });
  // });

});





