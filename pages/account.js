import { useState } from "react";

import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import "react-responsive-modal/styles.css";
import Modal from "react-responsive-modal";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

import { fadeIn } from "./../animation/motion";
import FlowLoader from "../components/FlowLoader";

const toastStyles = {
  fontSize: "2rem",
  fontWeight: "600",
  backgroundColor: "#212529",
  color: "#fff",
};

function Account() {
  const { user, isLoading } = useUser();
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const deleteAccount = async () => {
    toast.loading("Deleting...", {
      id: "delete",
      style: toastStyles,
    });
    try {
      const urls = ["/api/deleteAll", "/api/deleteUser"];
      const res = await Promise.all(urls.map((url) => fetch(url)));
      const status = res.every((r) => r.ok === true);
      console.log(status);
      if (!status) {
        toast.remove("delete");
        toast.error("Something went wrong", { style: toastStyles });
        onCloseModal();
        return;
      }

      toast.remove("delete");
      toast.success("Account Deleted", { style: toastStyles });

      if (typeof window !== "undefined") {
        window.location.href = "/api/auth/logout";
      }
    } catch (err) {
      toast.remove("delete");
      toast.error(err.message, { style: toastStyles });
    }
  };

  if (isLoading) {
    return <FlowLoader />;
  }

  return (
    <motion.div
      className="account"
      initial="initial"
      animate="animate"
      exit="initial"
      variants={fadeIn}
    >
      <h1 className="account__heading">Hi, {user?.nickname} !</h1>
      <div className="account__details">
        <img
          src={user?.picture}
          alt="Profile Pic"
          className="account__details-avatar"
          width="60"
          height="60"
        />
        <p className="account__details-username">{user?.nickname}</p>
      </div>
      <div className="account__delete">
        <button className="account__delete-btn" onClick={onOpenModal}>
          Delete Account
        </button>
      </div>

      <Toaster position="top-right" />

      <Modal
        open={open}
        onClose={onCloseModal}
        center
        styles={{
          overlay: {
            background: "rgba(0,0,0,0.7)",
          },
          modal: {
            backgroundColor: "#212529",
            color: "#fff",
            maxWidth: "500px",
            borderRadius: "5px",
            padding: "4rem",
          },
          closeIcon: {
            display: "none",
          },
        }}
      >
        <div className="confirm__modal">
          <h1 className="confirm__modal-heading">Delete Account</h1>
          <p className="confirm__modal-text">
            All your data will be deleted. This action cannot be undone. Are you
            sure ?
          </p>
          <button className="confirm__modal-btn" onClick={onCloseModal}>
            Cancel
          </button>
          <button className="confirm__modal-btn" onClick={deleteAccount}>
            Delete
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}

export default Account;

export const getServerSideProps = withPageAuthRequired();
