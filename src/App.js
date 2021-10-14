import axios from 'axios';
import React, { Component } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import Hasil from './components/Hasil';
import ListCategories from './components/ListCategories';
import Menus from './components/Menus';
import NavbarComponent from './components/NavbarComponent'
import { API_URL } from './utils/constants';

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menus: [],
      categoriYangDipilih: 'Makanan'
    }
  }

  componentDidMount() {
    axios.get(API_URL + "products?category.nama="+this.state.categoriYangDipilih)
      .then(res => {
        const menus = res.data;
        this.setState({ menus });
      })
      //jika gagal
      .catch(error => {
        console.log("eror yaaa", error);
      })
  }

  changeCategory = (value) => {
    this.setState({
      categoriYangDipilih: value,
      menus: []
    })
    axios.get(API_URL + "products?category.nama="+value)
      .then(res => {
        const menus = res.data;
        this.setState({ menus });
      })
      //jika gagal
      .catch(error => {
        console.log("eror yaaa", error);
      })
  }

  render() {
    const { menus, categoriYangDipilih } = this.state
    return (
      <div className="App">
        <NavbarComponent />
        <div className="pt-3 color-cream">
          <Container fluid>
            <Row>
              <ListCategories changeCategory={this.changeCategory} categoriYangDipilih={categoriYangDipilih} />
              <Col>
                <h4><strong>Daftar Product</strong></h4>
                <hr />
                <Container>
                  <Row>
                    {menus && menus.map((menu) => (
                      <Menus
                        key={menu.id}
                        menu={menu}
                      />
                    ))}
                  </Row>
                </Container>
              </Col>
              <Hasil />
            </Row>
          </Container>
        </div>
      </div>
    )
  }
}

