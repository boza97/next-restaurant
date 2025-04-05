'use client';

import { ProductType } from '@/types/types';
import { useCartStore } from '@/utils/store';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Price = ({ product }: { product: ProductType }) => {
  const [total, setTotal] = useState(+product.price);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);

  const { addToCart } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    setTotal(
      quantity *
        (product.options?.length
          ? +product.price + +product.options[selected].additionalPrice
          : product.price)
    );
  }, [quantity, selected, product]);

  const handleCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      img: product.img,
      price: total,
      optionTitle: product.options?.length ? product.options[selected].title : undefined,
      quantity: quantity,
    });
    toast.success('The product added to the cart');
  };
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'>${total.toFixed(2)}</h2>

      <div className='flex gap-4'>
        {product.options?.length &&
          product.options?.map((option, index) => (
            <button
              key={option.title}
              className='min-w-[6rem] p-2 ring-1 ring-red-400 rounded-md cursor-pointer'
              style={{
                background: selected === index ? 'rgb(248 113 113)' : 'white',
                color: selected === index ? 'white' : 'red',
              }}
              onClick={() => setSelected(index)}
            >
              {option.title}
            </button>
          ))}
      </div>

      <div className='flex justify-between items-center'>
        <div className='flex justify-between w-full p-3 ring-1 ring-red-500'>
          <span>Quantity</span>
          <div className='flex gap-4 items-center'>
            <button
              className='cursor-pointer'
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              {'<'}
            </button>
            <span>{quantity}</span>
            <button
              className='cursor-pointer'
              onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))}
            >
              {'>'}
            </button>
          </div>
        </div>

        <button
          className='uppercase w-56 bg-red-500 text-white p-3 ring-1 ring-red-500'
          onClick={handleCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Price;
