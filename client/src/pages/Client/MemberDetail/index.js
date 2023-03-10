import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../../services/user";
import {
  checkUserFollower,
  createUserFollow,
  deleteUserFollow,
} from "../../../services/user-follow";
import { USER_KEY } from "../../../utils/constants";
import { formaDateInput, parseJSON } from "../../../utils/utils";
import "./style.scss";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Personal from "./components/PersonalInfo";
import PersonalPlaylist from "./components/PlaylistList";
import { toast } from "react-hot-toast";
import CustomModal from "../../../components/CustomModal";
import LoadingButton from "@mui/lab/LoadingButton";
import RTextField from "../../../components/RedditTextField";
import { createNewReportUser } from "../../../services/userReport";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function MemberDetail() {
  const [userInfo, setUserInfo] = useState({});
  const [memberHaveFollow, setMemberHaveFollow] = useState(false);
  const { id } = useParams();
  const userData = parseJSON(localStorage.getItem(USER_KEY), {});
  const [tabValue, setTabValue] = React.useState(0);
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleReportModal, setVisibleReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const checkMemberFollow = async () => {
    try {
      const result = await checkUserFollower(userData?._id, id);
      if (result?.data?.success) {
        setMemberHaveFollow(result?.data?.payload);
      }
    } catch (error) {
      console.log("check member follow error >>> ", error);
    }
  };

  const getUserInfo = async () => {
    try {
      const result = await getUserById(id);
      if (result?.data?.success) {
        setUserInfo({
          ...result?.data?.payload,
          birdthday: formaDateInput(result?.data?.payload?.birdthday),
        });
      }
    } catch (error) {
      console.log("get user info error >>> ", error);
    }
  };

  useEffect(() => {
    getUserInfo();
    checkMemberFollow();
  }, []);

  const handleUserFollower = async () => {
    try {
      let result = false;
      if (memberHaveFollow) {
        result = await deleteUserFollow(userData?._id, id);
      } else {
        result = await createUserFollow(userData?._id, id);
      }

      if (result?.data?.success) {
        checkMemberFollow();
        setVisibleConfirmModal(false);
        return toast.success("X??? l?? t??c v??? th??nh c??ng");
      }
      return toast.error("X??? l?? t??c v??? th???t b???i");
    } catch (error) {
      return toast.error("X??? l?? y??u c???u th???t b???i");
    }
  };

  const handleCreateUserReport = async () => {
    try {
      if (!reportReason?.trim()?.length) {
        return toast.error("L?? do b??o c??o kh??ng th??? b??? tr???ng");
      }

      const result = await createNewReportUser(userData?._id, id, reportReason);
      if (result?.data?.success) {
        toast.success(
          "B??o c??o t??i kho???n th??nh c??ng, ??ang ?????i qu???n tr??? vi??n duy???t"
        );
        setVisibleReportModal(false);
        return setReportReason("");
      }
      toast.error("B??o c??o t??i kho???n th???t b???i");
    } catch (error) {
      toast.error("B??o c??o t??i kho???n th???t b???i");
    }
  };

  return (
    <div>
      {visibleConfirmModal && (
        <CustomModal
          visible={visibleConfirmModal}
          onClose={() => {
            setVisibleConfirmModal(false);
          }}
          title={"X??c nh???n"}
          content={
            <div style={{ minWidth: "400px", textAlign: "center" }}>
              X??c nh???n th???c hi???n t??c v???
            </div>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={() => {
                handleUserFollower();
              }}
            >
              {"X??c nh???n"}
            </LoadingButton>
          }
        />
      )}

      {visibleReportModal && (
        <CustomModal
          visible={visibleReportModal}
          onClose={() => {
            setReportReason("");
            setVisibleReportModal(false);
          }}
          title={"B??o c??o t??i kho???n"}
          content={
            <div>
              <RTextField
                label="L?? do"
                value={reportReason || ""}
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) => setReportReason(event?.target?.value)}
              />
            </div>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={() => {
                handleCreateUserReport();
              }}
            >
              {"B??o c??o"}
            </LoadingButton>
          }
        />
      )}

      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(/img/bg-img/breadcumb3.jpg)" }}
      >
        <div className="bradcumbContent">
          <h2>Chi ti???t th??nh vi??n</h2>
        </div>
      </section>

      <div className="member-detail-head">
        <div className="left">
          <div className="member-avatar">{userInfo?.email?.[0] || "!"}</div>
        </div>
        <div className="right">
          <div className="member-email">{userInfo?.email}</div>
          <div className="member-control">
            <div>
              <button
                onClick={() => setVisibleConfirmModal(true)}
                style={{ cursor: "pointer" }}
              >
                {memberHaveFollow ? "Hu??? theo d??i" : "Theo d??i"}
              </button>
            </div>
            <div>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => setVisibleReportModal(true)}
              >
                B??o c??o th??nh vi??n
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 50px" }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Th??ng tin c?? nh??n" {...a11yProps(0)} />
              <Tab label="Playlist c?? nh??n" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <Personal userId={id} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <PersonalPlaylist userId={id} />
          </TabPanel>
        </Box>
      </div>
    </div>
  );
}
