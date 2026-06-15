// import React from 'react'

// export default function AdminProducts() {
//   return (
//     <div>AdminProducts</div>
//   )
// }


// import ProductImageUpload from "@/src/component/admin-view/ProductImageUpload";
import AdminProductTile from "@/src/component/admin-view/AdminProductTile";
import CommonForm from "@/src/component/common/CommonForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { addProductFormElements } from "@/src/config/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/src/store/admin-slice/Product_slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import ProductImageUpload from "@/src/component/admin-view/ProductImageUpload";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  // const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

      currentEditedId !== null
        ? dispatch(
// OLD CODE:
//             editProduct({
//               id: currentEditedId,
//               formData,
//             })
// NEW CODE:
            editProduct({
              id: currentEditedId,
              formData: { ...formData, image: uploadedImageUrl },
            })
          ).then((data) => {
            console.log(data, "edit");

// OLD CODE:
//             if (data?.payload?.success) {
//               dispatch(fetchAllProducts());
//               setFormData(initialFormData);
//               setOpenCreateProductsDialog(false);
//               setCurrentEditedId(null);
//             }
// NEW CODE:
            if (data?.payload?.success) {
              dispatch(fetchAllProducts());
              setFormData(initialFormData);
              setOpenCreateProductsDialog(false);
              setCurrentEditedId(null);
              setImageFile(null);
              setUploadedImageUrl("");
            }
          })
        : dispatch(
            addNewProduct({
              ...formData,
              image: uploadedImageUrl,
            })
          ).then((data) => {
            if (data?.payload?.success) {
              dispatch(fetchAllProducts());
              setOpenCreateProductsDialog(false);
              setImageFile(null);
              setFormData(initialFormData);
              toast("Product added successfully");
            }
          });
    }

    function handleDelete(getCurrentProductId) {
      dispatch(deleteProduct(getCurrentProductId)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
        }
      });
    }

// OLD CODE:
//   function isFormValid() {
//     return Object.keys(formData)
//       .filter((currentKey) => currentKey !== "averageReview")
//       .map((key) => formData[key] !== "")
//       .every((item) => item);
//   }
// NEW CODE:
  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item) && uploadedImageUrl !== "";
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // console.log(productList, "productList");

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      {/* show the product in admin products page */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
// OLD CODE:
//               <AdminProductTile
//                 key={productItem._id}
//                 setFormData={setFormData}
//                 setOpenCreateProductsDialog={setOpenCreateProductsDialog}
//                 setCurrentEditedId={setCurrentEditedId}
//                 product={productItem}
//                 handleDelete={handleDelete}
//               />
// NEW CODE:
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
                setUploadedImageUrl={setUploadedImageUrl}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
// OLD CODE:
//         onOpenChange={() => {
//           setOpenCreateProductsDialog(false);
//           setCurrentEditedId(null);
//           setFormData(initialFormData);
//         }}
// NEW CODE:
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFile(null);
          setUploadedImageUrl("");
        }}
      >
        {/* sidebar for add or edit product */}
        <SheetContent side="right" className="overflow-auto px-3">
          {/* header */}
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Form to add a new product or edit an existing product's details.
            </SheetDescription>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}


export default AdminProducts;