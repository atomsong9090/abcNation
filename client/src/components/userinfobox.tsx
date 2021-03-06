import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import avatar from "../assets/avatar.svg";
import backgroundimg from "../assets/images.svg";

export default function UserInfoBox(props: any): ReactElement {
  const accessToken = sessionStorage.getItem("accessToken");

  const [userInfo, setUserInfo]: any = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = React.useState<string[]>([]);

  async function createNewContent() {
    if (text && title) {
      await axios
        .post(
          "/content",
          { title: title, text: text, category: category, imgUrls: JSON.stringify(images) },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        .catch((err) => {
          window.location.reload();
          console.log(err);
        });
      window.location.reload();
    } else {
      alert("must write the title and content");
    }
  }

  function getText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }
  function getTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  const history = useHistory();
  let currentPage = history.location.pathname;
  let pageName = currentPage.slice(1);
  let pageColor = "#8469e3";
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  if (pageName === "Culture") {
    pageColor = "#44CF86";
  } else if (pageName === "History") {
    pageColor = "#FFC0CB";
  } else if (pageName === "Travel") {
    pageColor = "#87CEEB";
  }
  useEffect(() => {
    if (!userInfo) {
      axios
        .get("user", { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((res) => setUserInfo(res.data.data));
    }

    if (pageName === "") {
      setCategory("Language");
      props.getCategory("Language");
    } else {
      setCategory(pageName);
      props.getCategory(pageName);
    }
  }, [pageName, props, accessToken, userInfo]);

  async function imageOnchange(event: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    const file: any = event.target.files;
    const previewImgs: any = document.querySelector(".imgs");
    const description: any = document.querySelector(".description");
    const previewImgLength = previewImgs.childElementCount;
    reader.onload = () => {
      const img: any = document.createElement("img");
      img.classList.add("img");
      img.setAttribute("src", reader.result);
      img.setAttribute("style", "border:1px solid black");
      img.setAttribute("style", "width:4rem");
      img.setAttribute("style", "height:4rem");

      if (previewImgLength >= 3) {
        alert("you can upload maximum 3 images");
      } else {
        previewImgs.appendChild(img);
      }
    };

    if (description) {
      description.remove();
    }

    if (file.length !== 0) {
      reader.readAsDataURL(file[0]);
      if (event.target.files !== null && previewImgLength < 3) {
        const fd: any = new FormData();
        fd.append("imgs", event.target.files[0]);
        axios.post("/image", fd).then((res) => setImages(images.concat(res.data[0].location)));
      }
    }
  }
  function openSignInModal() {
    const SignUpModal: any = document.querySelector(".signup");
    const SignInModal: any = document.querySelector(".signin");

    if (SignUpModal.style.display === "none") {
      SignInModal.style.display = "flex";
    }
  }

  return (
    <Main>
      <CurrentLocation style={{ backgroundColor: pageColor }}>{pageName ? pageName : "Language"}</CurrentLocation>
      <InfoBox>
        <UserInfo>
          <AvatarBox>
            {sessionStorage.getItem("login") === "ok" ? (
              <>
                <Avatar src={userInfo.avatarUrl ? userInfo.avatarUrl : avatar} />
                <UserName>{userInfo.nickname ? userInfo.nickname : "Anonymous"}</UserName>
              </>
            ) : null}
          </AvatarBox>
        </UserInfo>
        {sessionStorage.getItem("login") === "ok" ? (
          <>
            <ConttentBox>
              <ContentTitle onChange={getTitle} placeholder="title" />
              <ContentText onChange={getText} placeholder="Ask your question in here ..." />
            </ConttentBox>

            <UploadSection
              className="upload"
              method="post"
              target="imgs"
              encType="multipart/form-data"
              action="uploadForm"
            >
              <ImgUploadBtn htmlFor="input-file"></ImgUploadBtn>
              <Picture
                id="input-file"
                type="file"
                accept="image/png, image/jpeg"
                onChange={imageOnchange}
                style={{ display: "none" }}
              />
              <Imgs className="imgs">
                {" "}
                <Description className="description">you can upload Maximum 3 photos</Description>
              </Imgs>
            </UploadSection>
            <SubmitBtn onClick={createNewContent}>Create</SubmitBtn>
          </>
        ) : (
          <NoticeBox>
            <AskBox>Do you want post your question?</AskBox>
            <LoginBox onClick={openSignInModal}>
              <Logo>ABCNATION</Logo>
              <Login>Sign In</Login>
            </LoginBox>
          </NoticeBox>
        )}
      </InfoBox>
    </Main>
  );
}
const Main = styled.div`
  width: 20rem;
  display: flex;
  flex-direction: column;
  //position: fixed;
  margin-left: 3rem;
  margin-top: 1rem;
`;

const CurrentLocation = styled.div`
  margin-top: 1rem;
  width: 100%;
  height: 3rem;
  font-size: 2.5rem;
  border: 0.1rem solid grey;
  display: flex;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const InfoBox = styled.div`
  margin-top: 0.5rem;
  width: 20rem;
  height: 31rem;
  background-color: white;
  border: 0.1rem solid grey;
`;

const UserInfo = styled.div`
  display: flex;
  margin: 0.5rem;
  flex-direction: column;
`;
const AvatarBox = styled.div`
  display: flex;
  align-items: flex-end;
`;
const Avatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border: 0.1rem solid grey;
  border-radius: 50%;
`;
const UserName = styled.div`
  margin-left: 0.5rem;
  display: flex;
  font-size: 1.5rem;
  font-weight: 600;
  align-items: flex-end;
`;

const ConttentBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const ContentTitle = styled.input`
  display: flex;
  height: 1.5rem;
  width: 17rem;
  margin: 0.5rem auto;
  font-size: 1.2rem;
`;
const ContentText = styled.textarea`
  resize: none;
  width: 17rem;
  margin: 0.2rem auto;
  height: 10rem;
  border: 0.1rem solid grey;
  border-radius: 0.5rem;
  //background-color: #f3e9e9;
`;
const SubmitBtn = styled.button`
  margin: 3rem 1.5rem;
  width: 8rem;
  height: 2rem;
  font-size: 1.5rem;
  background-color: #869cb9;
  border: 0.1rem solid black;
  color: white;
  &:hover {
    background-color: grey;
    color: white;
    cursor: pointer;
  }
`;
const Picture = styled.input``;
const UploadSection = styled.form`
  margin-top: 1rem;
`;
const Imgs = styled.div`
  width: 11rem;
  height: 4rem;
  background-color: #eeeaea;
  border: 0.1rem solid black;
  display: flex;
  margin-top: 1.2rem;
  margin-left: 1.3rem;
`;

const ImgUploadBtn = styled.label`
  padding: 1.2rem 1.05rem;
  font-size: 0rem;
  margin: 1.3rem;
  background-image: url(${backgroundimg});
  &:hover {
    cursor: pointer;
  }
`;
const Description = styled.div`
  color: grey;
`;

const NoticeBox = styled.div`
  display: flex;
  width: 18rem;
  height: 7rem;
  flex-direction: column;
  margin: 3rem auto;
  border: 0.1rem solid black;
  background-color: #424040;
`;
const AskBox = styled.div`
  display: flex;
  height: 1.2rem;
  margin: 0.1rem auto;
  font-size: 1.2rem;
  color: white;
`;

const LoginBox = styled.div`
  display: flex;
  background-color: white;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  width: 15rem;
  margin: 1rem auto;
  border: 0.1rem solid grey;
  border-radius: 0.5rem;
  cursor: pointer;
`;
const Logo = styled.div`
  font-weight: bold;
  color: blue;
  font-style: oblique;
`;
const Login = styled.div`
  margin-left: 0.3rem;
`;
