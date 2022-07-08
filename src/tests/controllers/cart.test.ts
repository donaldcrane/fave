import chai from "chai";
import chaiHttp from "chai-http";
import { user, user4 } from "./user-sign-in-test-data";
import { cart, cart2, cart3 } from "./cart-data";
import server from "../../app";
import { ICart } from "../../utils/interface";

chai.should();

const { expect } = chai;
chai.use(chaiHttp);

describe("Create user cart", () => {
  let userToken: string;
  before(done => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(user)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data.token;
        done();
      });
  });
  it("should allow user create cart", done => {
    chai
      .request(server)
      .patch("/api/v1/carts/product")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(cart)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("Cart created successfully");
        done();
      });
  });
  it("should not allow user create cart with incomplete details", done => {
    chai
      .request(server)
      .patch("/api/v1/carts/product")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(cart2)
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
  it("should not allow user without token create cart", done => {
    chai
      .request(server)
      .patch("/api/v1/carts/product")
      .set("Accept", "application/json")
      .send(cart3)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.equal("Authorization not found");
        done();
      });
  });
});

describe("Should allow user remove product from cart", () => {
  let userToken: string;
  before(done => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(user4)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data.token;
        done();
      });
  });
  it("should allow user remove product from cart", done => {
    chai
      .request(server)
      .patch("/api/v1/carts/remove?productId=6186f39a38a969e972804ad7&cartId=62c75ee1b8cd73dc5aa50c15")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Product successfully removed from Cart.");
        done();
      });
  });
  it("should not allow user remove product that does not exist from cart", done => {
    chai
      .request(server)
      .patch("/api/v1/carts/remove?productId=6186f39a38a969e222804ad7&cartId=62c75ee1b8cd73dc5aa50c22")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal("Cart not found.");
        done();
      });
  });
  it("should not allow user without token add product to cart", done => {
    chai
      .request(server)
      .patch("/api/v1/carts/remove?productId=6186f39a38a969e972804ad7&cartId=62c75ee1b8cd73dc5aa50c15")
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.equal("Authorization not found");
        done();
      });
  });
});

describe("Delete user cart", () => {
  let userToken: string;
  before(done => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(user4)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data.token;
        done();
      });
  });
  it("should allow User Delete his cart", done => {
    chai
      .request(server)
      .delete("/api/v1/carts/62c75ee1b8cd73dc5aa50c15")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Successfully Deleted Cart.");
        done();
      });
  });
  it("returns 404 when deleting cart which is not in database", done => {
    chai
      .request(server)
      .delete("/api/v1/carts/6186f39a38a969e974422bdd")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal("Cart not found.");
        done();
      });
  });
});

describe("GET Cart api route", () => {
  beforeEach(async () => {
    let userToken: string;
    before(done => {
      chai
        .request(server)
        .post("/api/v1/users/signin")
        .set("Accept", "application/json")
        .send(user)
        .end((err, res) => {
          if (err) throw err;
          userToken = res.body.data.token;
          done();
        });
    });
    it("returns all Carts", done => {
      chai
        .request(server)
        .get("/api/v1/carts")
        .set("Authorization", `Bearer ${userToken}`)
        .end((err, res) => {
          const { body } = res;
          const { data } = body;
          expect(body.statusCode).to.equal(200);
          expect(body.message).to.equal("uccessfully retrieved user cart.");

          data.forEach((carts: ICart[]) => {
            expect(carts).to.have.property("_id");
            expect(carts).to.have.property("user");
            expect(carts).to.have.property("products");
            expect(carts).to.have.property("quantity");
          });

          expect(data).to.be.an("object");
          done();
        });
    });
  });
});
