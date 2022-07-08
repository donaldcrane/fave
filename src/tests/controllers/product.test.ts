import chai from "chai";
import chaiHttp from "chai-http";
import { user4, admin } from "./user-sign-in-test-data";
import { product, product2, product3, product4, product5 } from "./product-data";
import server from "../../app";
import { IProduct } from "../../utils/interface";

chai.should();

const { expect } = chai;
chai.use(chaiHttp);

describe("Add product", () => {
  let userToken: string;
  before(done => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(admin)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data.token;
        done();
      });
  });
  it("should allow Admin with token add product", done => {
    chai
      .request(server)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(product)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  it("should not allow admin add product with incomplete details", done => {
    chai
      .request(server)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(product2)
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
  it("should not allow user without token add product", done => {
    chai
      .request(server)
      .post("/api/v1/products")
      .send(product3)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.equal("Authorization not found");
        done();
      });
  });
});

describe("Delete product", () => {
  let userToken: string;
  before(done => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(admin)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data.token;
        done();
      });
  });
  it("should allow User Delete a product", done => {
    chai
      .request(server)
      .delete("/api/v1/products/6186f39a38a969e972804ad3")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Successfully Deleted Product.");
        done();
      });
  });
  it("returns 404 when deleting product which is not in database", done => {
    chai
      .request(server)
      .delete("/api/v1/products/6186f39a38a969e972200ad9")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal("Product not found.");
        done();
      });
  });
});

describe("Update product", () => {
  let userToken: string;
  before(done => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(admin)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data.token;
        done();
      });
  });
  it("should allow Admin Update a product", done => {
    chai
      .request(server)
      .patch("/api/v1/products/6186f39a38a969e972804ad4")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(product)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Successfully updated Product.");
        done();
      });
  });
  it("returns 404 when updating product which is not in database", done => {
    chai
      .request(server)
      .patch("/api/v1/products/6186f39a38a969e972200ad9")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(product)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal("Product not found.");
        done();
      });
  });
});

describe("GET product api route", () => {
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
  it("returns all products", done => {
    chai
      .request(server)
      .get("/api/v1/products")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        const { body } = res;
        const { data } = body;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Successfully retrieved all Products.");

        data.forEach((products: IProduct[]) => {
          expect(products).to.have.property("_id");
          expect(products).to.have.property("name");
          expect(products).to.have.property("price");
          expect(products).to.have.property("quantity");
        });

        expect(data).to.be.an("array");
        done();
      });
  });

  it("returns product with specific id", done => {
    chai
      .request(server)
      .get("/api/v1/products/6186f39a38a969e972804ad5")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        const { body } = res;
        const { data } = body;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Successfully retrieved Product.");
        expect(data).to.have.property("_id");
        expect(data).to.have.property("name");
        expect(data).to.have.property("price");
        expect(data).to.have.property("quantity");

        expect(data).to.be.an("object");
        done();
      });
  });
});
