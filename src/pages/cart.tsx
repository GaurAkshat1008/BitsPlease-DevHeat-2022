import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useFirebase } from "../context/context";

interface cartProps {}

const cart: React.FC<cartProps> = ({}) => {
  const { getCartItems, useAuth } = useFirebase();
  const { isSigned, user, pending } = useAuth();
  const [items, setItems] = useState([]);
  // console.log(isSigned, user, pending);
  const cartItems = async () => {
    const data = await getCartItems();
    setItems(data)
    console.log(items)
  };
  
  // useEffect(() => {
  //   if(isSigned){
  //     cartItems();
  //   }
  // }, [isSigned]);

  return (
    <>
      <NavBar varient={"buyer"} />
    </>
  );
};

export default cart;
