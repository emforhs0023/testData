import React, { useContext, useState } from 'react';
import {
  Field, Formik, Form, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControlLabel,
  MenuItem,
  Radio,
} from '@material-ui/core';
import {
  RadioGroup,
  TextField,
  CheckboxWithLabel,
} from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import Timeline from '@material-ui/icons/Timeline';
import Code from '@material-ui/icons/Code';
import Group from '@material-ui/icons/Group';
import InfoArea from '../../components/InfoArea/InfoArea';

import image from '../../assets/img/bg7.jpg';
import signupPageStyle from '../../assets/jss/material-kit-pro-react/views/signupPageStyle';
import CardBody from '../../components/Card/CardBody';
import Card from '../../components/Card/Card';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import * as SelectItem from './selectItem';
import FirebaseContext from '../../components/Contexts/Firebase';
import LoadingOverlay from '../../components/LoadingOverlay/LodingOverlay';
import * as SendNotification from '../../components/SendNotification/SendNotification';

const useStyles = makeStyles(signupPageStyle);
const initialValues = {
  email: '',
  name: '',
  phone: '',
  age: '',
  password: '',
  confirmPassword: '',
  artistArea: '',
  isArtistActivity: true,
  serviceTerm: false,
  personalInformationTerm: false,
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('이메일 형식으로 입력해주세요')
    .required('이메일을 입력해주세요'),
  name: Yup.string()
    .required('이름을 입력해주세요'),
  phone: Yup.number()
    .typeError('연락처는 숫자만 입력해주세요.')
    .required('연락처를 입력해주세요'),
  age: Yup.string()
    .required('연령대를 선택해주세요')
    .oneOf(['10대', '20대', '30대', '40대', '50대', '60대', '70대이상'], '연령대를 선택해주세요'),
  password: Yup.string()
    .min(6, '비밀번호는 6자 이상 입력해주세요')
    .max(15, '비밀번호는 15자 이하로 입력해주세요')
    .required('비밀번호를 입력해주세요'),
  confirmPassword: Yup.string()
    .required('비밀번호를 재입력해주세요')
    .oneOf([Yup.ref('password')], '입력하신 비밀번호와 일치하지 않습니다.'),
  artistArea: Yup.string()
    .required('활동분야를 선택해주세요')
    .oneOf(['시각예술', '공연예술', '문학'], '예술인 분야를 선택해주세요'),
  isArtistActivity: Yup.string()
    .required('예술인 활동 유무를 선택해주세요'),
  serviceTerm: Yup.boolean()
    .oneOf([true], '서비스 이용약관에 동의해주세요'),
  personalInformationTerm: Yup.boolean()
    .oneOf([true], '개인정보처리방침에 동의해주세요'),
});


const JoinForm = () => {
  const firebase = useContext(FirebaseContext);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (values) => {
    setIsLoading(true);
    const {
      name, email, password, phone, age, artistArea, isArtistActivity,
    } = values;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(({ code: errorCode }) => {
        setIsLoading(false);
        if (errorCode === 'auth/email-already-in-use') {
          alert('이미 가입된 이메일 계정입니다.');
        } else if (errorCode === 'auth/weak-password') {
          alert('입력하신 비밀번호가 적합하지 않습니다.');
        } else if (errorCode === 'auth/invalid-email') {
          alert('입력하신 이메일 주소가 유효하지 않습니다.');
        } else {
          alert('오류가 발생하였습니다. 관리자에게 문의해주세요');
        }
      })
      .then((userCredentials) => {
        userCredentials.user.updateProfile({ displayName: name })
          .then(() => {
            firebase.firestore().collection('UsersCollection').doc(email).set({
              uid: userCredentials.user.uid,
              name,
              email,
              phone,
              age,
              position: 'ARTIST',
              artistArea,
              isArtistActivity,
              ongoingRequestCase: '',
              ongoingConsultingCase: '',
              completedConsultingCase: '',
              accountState: true,
              isAccountActive: true,
              registrationDate: new Date(),
              latestLoginDate: new Date(),
              isWithdrawUser: false,
              userLevel: 1,
            })
              .then(() => {
                SendNotification.SendEmailJoin(values);
                console.log('JOIN OK!');
              })
              .catch((error) => {
                console.log('JoinError', error);
              });
          });
      })
      .catch(() => {
      });
  };
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();


  return (
    <>
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={10} md={10}>
              <Card className={classes.cardSignup}>
                <h2 className={classes.cardTitle}>회원가입</h2>
                <CardBody>
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={5} md={5}>

                      <InfoArea
                        className={classes.infoArea}
                        title="회원가입시 주의사항"
                        description="회원가입 후 서비스 이용시 각종 알림에 대한 수신을 위해 정확한 이메일 계정과 휴대폰 번호를 입력해주세요."
                        icon={Timeline}
                        iconColor="rose"
                      />
                      <InfoArea
                        className={classes.infoArea}
                        title="약관 동의"
                        description="서비스 가입시 제공되는 이용약관 및 개인정보처리 방침은 사이트 하단 메뉴를 참고해주세요."
                        icon={Code}
                        iconColor="primary"
                      />
                      <InfoArea
                        className={classes.infoArea}
                        title="Contact Us"
                        description="서비스와 관련한 문의 사항은 부산문화재단 OOOOOOO으로 문의해주세요"
                        icon={Group}
                        iconColor="info"
                      />
                    </GridItem>
                    <GridItem xs={12} sm={5} md={5}>
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                      >
                        {({ isSubmitting }) => (

                          <Form>
                            <Field
                              disabled={false}
                              component={TextField}
                              name="email"
                              type="email"
                              label="Email"
                              fullWidth
                              className="formMb"
                            />

                            <Field
                              disabled={false}
                              component={TextField}
                              name="name"
                              type="text"
                              label="이름"
                              fullWidth
                              className="formMb"
                            />
                            <Field
                              disabled={false}
                              component={TextField}
                              name="phone"
                              type="text"
                              label="연락처"
                              fullWidth
                              className="formMb"
                            />
                            <Field
                              disabled={false}
                              component={TextField}
                              name="password"
                              type="password"
                              label="비밀번호"
                              fullWidth
                              className="formMb"
                            />
                            <Field
                              disabled={false}
                              component={TextField}
                              name="confirmPassword"
                              type="password"
                              label="비밀번호재입력"
                              fullWidth
                              className="formMb"
                            />
                            <Field
                              disabled={false}
                              component={TextField}
                              select
                              name="age"
                              label="연령대"
                              fullWidth
                              className="formMb"
                            >
                              {SelectItem.ages.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Field>
                            <Field
                              disabled={false}
                              component={TextField}
                              select
                              name="artistArea"
                              label="활동분야"
                              fullWidth
                              className="formMb"
                            >
                              {SelectItem.artistArea.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Field>

                            <Field
                              disabled={false}
                              component={RadioGroup}
                              name="isArtistActivity"
                              className="formMt"
                            >
                              <FormControlLabel
                                disabled={false}
                                value="Y"
                                label="예술인활동 유"
                                control={<Radio disabled={isSubmitting} />}
                              />
                              <FormControlLabel
                                disabled={false}
                                value="N"
                                control={<Radio disabled={isSubmitting} />}
                                label="예술인활동 무"
                              />
                            </Field>
                            <div className="fcRed"><ErrorMessage name="isArtistActivity" /></div>
                            <div>
                              <Field
                                disabled={false}
                                component={CheckboxWithLabel}
                                name="serviceTerm"
                                Label={{ label: '서비스이용약관 동의(필수)' }}
                              />
                              <div className="fcRed"><ErrorMessage name="serviceTerm" /></div>
                            </div>
                            <div>
                              <Field
                                disabled={false}
                                component={CheckboxWithLabel}
                                name="personalInformationTerm"
                                Label={{ label: '개인정보처리방침 동의(필수)' }}
                              />
                              <div className="fcRed"><ErrorMessage name="personalInformationTerm" /></div>
                            </div>
                            <Button
                              type="submit"
                              className="formMt mainColorBg"
                              variant="contained"

                            >
                              회원가입하기
                            </Button>
                          </Form>
                        )}
                      </Formik>
                    </GridItem>
                  </GridContainer>

                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
      <LoadingOverlay
        isLoading={isLoading}
      />
    </>
  );
};
export default JoinForm;