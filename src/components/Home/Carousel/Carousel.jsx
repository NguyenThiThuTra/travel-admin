import React from 'react';
import { Carousel } from 'antd';
import ButtonUI from '../../../common/ButtonUI/ButtonUI';
import { LIST_ITEM_SLIDER } from 'constants/slides';
import './Carousel.css';


const CarouselCpn = () => {
  return (
    <Carousel autoplay className="carousel" effect="fade">
      {LIST_ITEM_SLIDER.map((item) => (
        <div key={item.id} className="carousel__slider">
          <div>
            <div className="carousel__img_wrap">
              <img src={item.src} alt={`Slide ${item.id}`} />
            </div>
            <div className="carousel__content">
              <div className="carousel__content_main">
                <h1 className="carousel__title">{item.title} </h1>
                <div className="carousel__description">
                  Khám phá ngay bây giờ{' '}
                </div>
                <div>
                  <ButtonUI text="Đặt ngay" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselCpn;
