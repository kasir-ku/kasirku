import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Hasil from "../components/Hasil";
import ListCategories from "../components/ListCategories";
import Menus from "../components/Menus";
import swal from "sweetalert";
import axios from "axios";
import { API_URL } from "../utils/constants";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menus: [],
      categoriYangDipilih: "Makanan",
      keranjangs: [],
    };
  }

  componentDidMount() {
    axios
      .get(API_URL + "products?category.nama=" + this.state.categoriYangDipilih)
      .then((res) => {
        const menus = res.data;
        this.setState({ menus });
      })
      //jika gagal
      .catch((error) => {
        console.log("eror yaaa", error);
      });
    //Menampilkan keranjang ke hasil
    axios
      .get(API_URL + "keranjangs")
      .then((res) => {
        const keranjangs = res.data;
        this.setState({ keranjangs }); //dimasukkan ke state keranjangs
      })
      //jika gagal
      .catch((error) => {
        console.log("eror yaaa", error);
      });
  }

  componentDidUpdate(prevState) {
    //komponen ini agar slalu nge-run apakah ada perubahan di statenya
    if (this.state.keranjangs !== prevState.keranjangs) {
      axios
        .get(API_URL + "keranjangs")
        .then((res) => {
          const keranjangs = res.data;
          this.setState({ keranjangs }); //dimasukkan ke state keranjangs
        })
        //jika gagal
        .catch((error) => {
          console.log("eror yaaa", error);
        });
    }
  }

  changeCategory = (value) => {
    this.setState({
      categoriYangDipilih: value,
      menus: [],
    });
    axios
      .get(API_URL + "products?category.nama=" + value)
      .then((res) => {
        const menus = res.data;
        this.setState({ menus });
      })
      //jika gagal
      .catch((error) => {
        console.log("eror yaaa", error);
      });
  };

  masukKeranjang = (value) => {
    axios
      .get(API_URL + "keranjangs?product.id=" + value.id)
      .then((res) => {
        if (res.data.length === 0) {
          const keranjang = {
            jumlah: 1,
            total_harga: value.harga,
            product: value,
          };
          axios
            .post(API_URL + "keranjangs", keranjang)
            .then((res) => {
              swal({
                title: "SUKSES!",
                text: "Sukses Masuk Keranjang " + keranjang.product.nama,
                icon: "success",
                button: false,
                timer: 1300,
              });
            })
            //jika gagal
            .catch((error) => {
              console.log("eror yaaa", error);
            });
        } else {
          const keranjang = {
            jumlah: res.data[0].jumlah + 1,
            total_harga: res.data[0].total_harga + value.harga,
            product: value,
          };

          axios
            .put(API_URL + "keranjangs/" + res.data[0].id, keranjang)
            .then((res) => {
              swal({
                title: "SUKSES!",
                text: "Sukses Masuk Keranjang " + keranjang.product.nama,
                icon: "success",
                button: false,
                timer: 1300,
              });
            })
            //jika gagal
            .catch((error) => {
              console.log("eror yaaa", error);
            });
        }
      })
      //jika gagal
      .catch((error) => {
        console.log("eror yaaa", error);
      });
  };

  render() {
    const { menus, categoriYangDipilih, keranjangs } = this.state; //oper state ke sini
    return (
      <div>
        <Container fluid>
          <Row>
            <ListCategories
              changeCategory={this.changeCategory}
              categoriYangDipilih={categoriYangDipilih}
            />
            <Col>
              <h4>
                <strong>Daftar Product</strong>
              </h4>
              <hr />
              <Container>
                <Row>
                  {menus &&
                    menus.map((menu) => (
                      <Menus
                        key={menu.id}
                        menu={menu}
                        masukKeranjang={this.masukKeranjang}
                      />
                    ))}
                </Row>
              </Container>
            </Col>
            <Hasil keranjangs={keranjangs} {...this.props} />
          </Row>
        </Container>
      </div>
    );
  }
}
