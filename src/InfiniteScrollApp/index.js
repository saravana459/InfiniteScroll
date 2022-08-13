import React, { Component } from "react";
import "./styles.css";
import axios from "axios";

class InfiniteScrollApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      loading: false,
      page: 0,
      prevY: 0,
    };
  }
  getPhotos() {
    this.setState({
      loading: true,
    });
    axios
      .get(
        `https://jsonplaceholder.typicode.com/photos?_page=${this.state.page}&_limit=10`
      )
      .then((res) => {
        console.log(res.data);
        this.setState({
          photos: [...this.state.photos, ...res.data],
          loading: false,
        });
      });
  }

  handleObserver(entities, observer) {
    const y = entities[0].boundingClientRect.y;
    debugger;
    if (this.state.prevY > y) {
      const lastPhoto = this.state.photos[this.state.photos.length - 1];
      const curPage = lastPhoto.albumId;
      this.getPhotos(curPage);
      this.setState({ page: curPage });
    }
    this.setState({ prevY: y });
  }

  componentDidMount() {
    this.getPhotos();

    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    );
    this.observer.observe(this.loadingRef);
  }
  render() {
    return (
      <div className="container">
        <div>
          {this.state.photos.map((item) => {
            return <img src={item.url} height="100px" width="200px" />;
          })}
        </div>
        <div
          ref={(loadingRef) => (this.loadingRef = loadingRef)}
          className="loadingCSS"
        >
          <span style={{ display: this.state.loading ? "block" : "none" }}>
            Loading...!
          </span>
        </div>
      </div>
    );
  }
}

export default InfiniteScrollApp;
