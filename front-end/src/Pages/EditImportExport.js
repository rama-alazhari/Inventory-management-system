import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditImportExport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);

  const [storeId, setStoreId] = useState("");
  const [productId, setProductId] = useState("");
  const [inputOrOutput, setinputOrOutput] = useState("");
  const [refNumber, setrefNumber] = useState("");
  const [quantity, setquantity] = useState("");
  const [placeProduct, setplaceProduct] = useState("");
  const [note, setnote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const importExportRes = await axios.get(`http://localhost:8080/import-export/${id}`);
        const { storeId, productId, inputOrOutput, refNumber, quantity, placeProduct, note } = importExportRes.data;

        setStoreId(storeId._id);
        setProductId(productId._id);
        setinputOrOutput(inputOrOutput);
        setrefNumber(refNumber);
        setquantity(quantity);
        setplaceProduct(placeProduct);
        setnote(note);

        const storesRes = await axios.get("http://localhost:8080/store");
        setStores(storesRes.data);

        const productsRes = await axios.get("http://localhost:8080/products");
        setProducts(productsRes.data);
      } catch (err) {
        setErrorMessage("Failed to load data.");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const store = { storeId, productId, inputOrOutput, refNumber, quantity, placeProduct, note };
      await axios.patch(`http://localhost:8080/import-export/${id}`, store);
      alert("Updated successfully");
      navigate('/importandexport');
    } catch (err) {
      setErrorMessage("Failed to update the entry.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 mt-5 p-4 shadow-lg rounded bg-white">
          <h2 className="text-center mb-4">Edit Import / Export Entry</h2>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Store</label>
              <select value={storeId} className="form-control" onChange={e => setStoreId(e.target.value)}>
                <option value="">Select Store</option>
                {stores.map(store => (
                  <option key={store._id} value={store._id}>{store.storename}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Product</label>
              <select value={productId} className="form-control" onChange={e => setProductId(e.target.value)}>
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>{product.productName}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Type</label>
              <select value={inputOrOutput} className="form-control" onChange={e => setinputOrOutput(e.target.value)}>
                <option value="Import">Import</option>
                <option value="Export">Export</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Quantity</label>
              <input type="number" value={quantity} className="form-control" onChange={e => setquantity(e.target.value)} />
            </div>

            <div className="mb-3">
              <label>Ref Number</label>
              <input type="number" value={refNumber} className="form-control" onChange={e => setrefNumber(e.target.value)} />
            </div>

            <div className="mb-3">
              <label>Place Product</label>
              <input type="text" value={placeProduct} className="form-control" onChange={e => setplaceProduct(e.target.value)} />
            </div>

            <div className="mb-3">
              <label>Note</label>
              <input type="text" value={note} className="form-control" onChange={e => setnote(e.target.value)} />
            </div>

            <div className="d-flex justify-content-between">
              <button className='btn btn-secondary' onClick={() => navigate("/importandexport")}>Back</button>
              <button type="submit" className="btn btn-primary">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditImportExport;
