import Head from 'next/head'
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Folder.module.scss';
import { Api } from '../../utils/api';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { ModalFormInput } from '../../components/ModalsForm/ModalFormInput';
import { ModalFormTextarea } from '../../components/ModalsForm/ModalFormTextarea';
import { ModalFormCreateAccount } from '../../components/ModalsForm/ModalFormCreateAccount';
import { ModalLaunch } from '../../components/ModalsForm/ModalLaunch';
import { ModalFormSelect } from '../../components/ModalsForm/ModalFormSelect';
import { FoldersList } from '../../components/FoldersList';
import { AccountsList } from '../../components/AccountsList';
import Snackbar from "../../components/UI/Snackbar";
import { NavigationBar } from "../../components/NavigationBar";
import { CountAccounts } from "../../components/CountAccounts";
import { TbMessageCircle } from "react-icons/tb"
import { MdGroups, MdCreateNewFolder, MdOutlineDriveFileRenameOutline } from "react-icons/md"
import { FaUserEdit, FaRandom } from "react-icons/fa"
import { AiFillWechat } from "react-icons/ai"
import { FiUserPlus, FiMove } from "react-icons/fi"
import { RiDeleteBinFill } from "react-icons/ri"
import { BsFillPlayFill } from "react-icons/bs"
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'


const Folder = ({folders, accounts, accountsMove, countAccounts, dataFolder, pathHash, foldersMove, error}) => {
    const snackbarRef = useRef(null);
    const router = useRouter();
    const [modalCreateFolder, setModalCreateFolder] = useState(false);
    const [modalRename, setModalRename] = useState(false);
	const [modalChat, setModalChat] = useState(false);
	const [modalMessage, setModalMessage] = useState(false);
	const [modalUsernames, setModalUsernames] = useState(false);
	const [modalGroups, setModalGroups] = useState(false);
	const [modalMove, setModalMove] = useState(false);
	const [modalCreateAccount, setModaleCreateAccount] = useState(false);
	const [modalLaunch, setModalLaunch] = useState(false);

	const showSnackbar = (message, type) => {
		if (snackbarRef.current)
	        snackbarRef.current.show(message, type);
    }

	if (error) {
        showSnackbar(error, 'error')
    }

    async function createFolder(folderName) {
        try {
            await Api().inviting.createFolderInFolder(router.query.id, folderName);
            refreshData()
        } catch (e) {
            showSnackbar('???????????? ?????? ???????????????? ??????????', 'error')
        }
    }

    async function renameFolder(folderName) {
        try {
            await Api().inviting.renameFolder(router.query.id, folderName);
            refreshData();
        } catch (e) {
            showSnackbar('???????????? ?????? ???????????????????????????????? ??????????', 'error')
        }
    }

	async function changeChat(chatName) {
		try {
			await Api().inviting.changeChat(router.query.id, chatName);
			dataFolder.chat = chatName;
		} catch (e) {
			showSnackbar('???????????? ?????? ?????????????????? ????????', 'error')
		}
	}

	async function changeMessage(message) {
		try {
			await Api().inviting.addMessage(router.query.id, message);
			dataFolder.message = message;
		} catch (e) {
			showSnackbar('???????????? ?????? ?????????????????? ??????????????????', 'error')
		}
	}

	async function changeUsernames(usernames) {
		try {
			const noDupUsernames = new Set(usernames.split("\n"));
			await Api().inviting.changeUsernames(router.query.id, [...noDupUsernames]);
			dataFolder.usernames = [...noDupUsernames];
		} catch (e) {
			showSnackbar('???????????? ?????? ???????????????????? usernames', 'error')
		}
	}

	async function changeGroups(groups) {
		try {
			const noDupGroups = new Set(groups.split("\n"));
			await Api().inviting.changeGroups(router.query.id, [...noDupGroups]);
			dataFolder.groups = [...noDupGroups];
		} catch (e) {
			showSnackbar('???????????? ?????? ???????????????????? ??????????', 'error')
		}
	}

	async function moveFolder(path) {
		try {
			await Api().inviting.moveFolder(router.query.id, path);
			refreshData()
		} catch (e) {
			showSnackbar('???????????? ?????? ?????????????????????? ??????????', 'error')
		}
	}

	async function deleteFolder() {
		try {
			const response = await Api().inviting.deleteFolder(router.query.id);

			if (response.data === "/")
                router.push('/inviting')
			else 
                router.push(`/folder/${response.data}`)
		} catch (e) {
			showSnackbar('???????????? ?????? ???????????????? ??????????', 'error')
		}
	}

	async function deleteAccount(account) {
        try {
			await Api().inviting.deleteAccount(router.query.id, account.id);
			refreshData()
		} catch (e) {
			showSnackbar('???????????? ?????? ???????????????? ????????????????', 'error')
		}
    }

	async function geterateInterval() {
		try {
			await Api().inviting.geterateInterval(router.query.id);
			refreshData()
		} catch (e) {
			showSnackbar('???????????? ?????? ?????????????????? ????????????????????', 'error')
		}
	}

	async function sendCodeParsing(accountID) {
		try {
			await Api().inviting.sendCodeParsing(router.query.id, accountID);
		} catch (e) {
			showSnackbar('???????????? ?????? ???????????????? ????????', 'error')
		}
	}

	async function parsingApi(accountID, code) {
		try {
			if (code === '') {
				setIsError('???? ???? ?????????? ??????');
				setTimeout(() => {
					setIsError(null)
				}, timeout)
			}
			else {
				await Api().inviting.parsingApi(router.query.id, accountID, code);
				refreshData()
			}
		} catch (e) {
			showSnackbar('???????????? ?????? ???????????????? API', 'error')
		}
	}

	async function sendCodeSession(accountID) {
		try {
			await Api().inviting.sendCodeSession(router.query.id, accountID);
		} catch (e) {
			showSnackbar('???????????? ?????? ???????????????? ????????', 'error')
		}
	}

	async function createSession(accountID, code) {
		try {
			if (code === '') {
				showSnackbar('???? ???? ?????????? ??????', 'error');
			}
			else {
				await Api().inviting.createSession(router.query.id, accountID, code);
				refreshData()
			}
		} catch (e) {
			showSnackbar('???????????? ?????? ???????????????? .session ??????????', 'error')
		}
	}

    const getModalInput = (getInput) => {
		if (getInput.mode === "createFolder") {
			setModalCreateFolder(false);
			createFolder(getInput.text);
		} 
		else if (getInput.mode === "renameFolder") {
			setModalRename(false);
			renameFolder(getInput.text);
		}
        else if (getInput.mode === "changeChat") {
			setModalChat(false);
			changeChat(getInput.text);
		}
		else if (getInput.mode === "changeMessage") {
			setModalMessage(false);
			changeMessage(getInput.text);
		}
		else if (getInput.mode === "changeUsernames") {
			setModalUsernames(false);
			changeUsernames(getInput.text);
		}
		else if (getInput.mode === "changeGroups") {
			setModalGroups(false);
			changeGroups(getInput.text);
		}
	}

	const getModalSelect = (getSelect) => {
		setModalMove(false);
		if (getSelect.path !== "")
			moveFolder(getSelect.path);
	}

	const getModalLaunch = (mode=null) => {
		setModalLaunch(false);
		fetchDataFolder('reload_accounts');
		
		if (mode === 'inviting')
			dataFolder.inviting = true
		else if (mode === 'mailing_usernames')
			dataFolder.mailing_usernames = true
		else if (mode === 'mailing_groups')
			dataFolder.mailing_groups = true
	}

	const closeAfterCreate = () => {
        setModaleCreateAccount(false)
		refreshData()
    }

    const refreshData = () => {
		router.replace(router.asPath);
	}

    return (
        <div className={styles.folder}>
            <Head>
                <title>?????????? - {dataFolder.name}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

			<div className={styles.folder__header}>
				<NavigationBar pathHash={pathHash} service='inviting' />
				<CountAccounts countAccounts={countAccounts} />
			</div>

            <ButtonToolbar className={styles.actions}>
                {accounts.length === 0 && folders.length === 0 &&
                    <button className={styles.delete} onClick={deleteFolder}>
                        <RiDeleteBinFill className={styles.delete__icon} />
                    </button>
                }

                {accounts.length !== 0 &&
                    <Button mode='fill' onClick={() => setModalLaunch(true)}>
                        <p className={styles.action__item}>
                            <BsFillPlayFill className={styles.action__icon}/> 
                            ??????????????????
                        </p>
                    </Button>
                }

                <Button mode='fill' onClick={() => setModalMessage(true)}>
					<p className={styles.action__item}>
						<TbMessageCircle className={styles.action__icon}/> 
						??????????????????
					</p>
				</Button>

                <Button mode='fill' onClick={() => setModalGroups(true)}>
					<p className={styles.action__item}>
						<MdGroups className={styles.action__icon}/> 
						????????????
					</p>
				</Button>

                <Button mode='fill' onClick={() => setModalUsernames(true)}>
					<p className={styles.action__item}>
						<FaUserEdit className={styles.action__icon}/> 
						Username
					</p>
				</Button>

                <Button mode='fill' onClick={() => setModalChat(true)}>
					<p className={styles.action__item}>
						<AiFillWechat className={styles.action__icon}/> 
						??????
					</p>
				</Button>

                <Button mode='fill' onClick={() => setModalCreateFolder(true)}>
					<p className={styles.action__item}>
						<MdCreateNewFolder className={styles.action__icon}/> 
						??????????
					</p>
				</Button>

                <Button mode='fill' onClick={() => setModaleCreateAccount(true)}>
					<p className={styles.action__item}>
						<FiUserPlus className={styles.action__icon}/> 
						??????????????
					</p>
				</Button>

                <Button mode='fill' onClick={() => setModalMove(true)}>
					<p className={styles.action__item}>
						<FiMove className={styles.action__icon}/> 
						??????????????????????
					</p>
				</Button>

                <Button mode='fill' onClick={() => setModalRename(true)}>
					<p className={styles.action__item}>
						<MdOutlineDriveFileRenameOutline className={styles.action__icon}/> 
						??????????????????????????
					</p>
				</Button>

                <Button mode='fill' onClick={geterateInterval}>
					<p className={styles.action__item}>
						<FaRandom className={styles.action__icon}/> 
						??????????????????????????
					</p>
				</Button>
            </ButtonToolbar>

            {folders && folders.length !== 0 &&
                <FoldersList folders={folders} />
            }

            {accounts.length === 0
				? <h4 className={styles.notification}>?? ?????? ???????? ?????? ??????????????????</h4>
				: <AccountsList
					accounts={accounts} 
					accountsMove={accountsMove}
					folderName={dataFolder.name}
                    remove={deleteAccount} 
                    sendCodeParsing={sendCodeParsing} 
                    parsingApi={parsingApi} 
                    sendCodeSession={sendCodeSession} 
                    createSession={createSession} 
                />
			}

            <Modal title="???????????????? ??????????" visible={modalCreateFolder} setVisible={setModalCreateFolder}>
                <ModalFormInput create={getModalInput} buttonText="??????????????" mode="createFolder"/>
            </Modal>

            <Modal title="???????????????????????????? ??????????" visible={modalRename} setVisible={setModalRename}>
                {dataFolder.name
                    ?
                    <ModalFormInput create={getModalInput} buttonText="??????????????????" mode="renameFolder" defaultData={dataFolder.name}/>
                    :
                    <ModalFormInput create={getModalInput}buttonText="??????????????????" mode="renameFolder" defaultData=""/>
                }
            </Modal>

            <Modal title="?????????????????? ????????" visible={modalChat} setVisible={setModalChat}>
                {dataFolder.chat
                    ?
                    <ModalFormInput create={getModalInput} buttonText="??????????????????" mode="changeChat" defaultData={dataFolder.chat}/>
                    :
                    <ModalFormInput create={getModalInput} buttonText="??????????????????" mode="changeChat" defaultData=""/>
                }
            </Modal>

            <Modal title="?????????????????? ??????????????????" visible={modalMessage} setVisible={setModalMessage}>
                {dataFolder.message
                    ?
                    <ModalFormTextarea create={getModalInput} buttonText="??????????????????" mode="changeMessage" placeholderText="?????????????? ??????????????????" defaultData={dataFolder.message}/>
                    :
                    <ModalFormTextarea create={getModalInput} buttonText="??????????????????" mode="changeMessage" placeholderText="?????????????? ??????????????????" defaultData=""/>
                }
            </Modal>

            <Modal title="???????????????????? usernames" visible={modalUsernames} setVisible={setModalUsernames}>
                {dataFolder.usernames
                    ?
                    <ModalFormTextarea create={getModalInput} buttonText="??????????????????" mode="changeUsernames" placeholderText="?????????????? ??????????????????????????" defaultData={dataFolder.usernames}/>
                    :
                    <ModalFormTextarea create={getModalInput} buttonText="??????????????????" mode="changeUsernames" placeholderText="?????????????? ??????????????????????????" defaultData=""/>
                }
            </Modal>

            <Modal title="???????????????????? ??????????" visible={modalGroups} setVisible={setModalGroups}>
                {dataFolder.groups
                    ?
                    <ModalFormTextarea create={getModalInput} buttonText="??????????????????" mode="changeGroups" placeholderText="?????????????? ????????????" defaultData={dataFolder.groups}/>
                    :
                    <ModalFormTextarea create={getModalInput} buttonText="??????????????????" mode="changeGroups" placeholderText="?????????????? ????????????" defaultData=""/>
                }
            </Modal>

            {foldersMove &&
                <Modal title="?????????????????????? ??????????" visible={modalMove} setVisible={setModalMove}>
                    {dataFolder.name_path &&
                        Object.keys(foldersMove).length !== 0
                            ?
                            <ModalFormSelect create={getModalSelect} optionsData={foldersMove} defaultName={dataFolder.name_path}/>
                            :
                            <ModalFormSelect create={getModalSelect} optionsData={[]} defaultName={dataFolder.name_path}/>
                    }
                </Modal>
            }

			<Modal title="???????????????? ????????????????" visible={modalCreateAccount} setVisible={setModaleCreateAccount}>
                <ModalFormCreateAccount closeAfterCreate={closeAfterCreate} />
            </Modal>

			<Modal title="???????????????? ????????????????" visible={modalLaunch} setVisible={setModalLaunch}>
                <ModalLaunch launch={getModalLaunch} folder={dataFolder} />
            </Modal>

            <Snackbar ref={snackbarRef} />
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    try {
        const response = await Api(ctx).inviting.getFolderById(ctx.params.id);
        const foldersMove = await Api(ctx).inviting.getFoldedrsMove(ctx.params.id)
		
        return {
            props: {
                folders: response.data.folders ? response.data.folders : [],
                accounts: response.data.accounts ? response.data.accounts : [],
				accountsMove: response.data.accountsMove ? response.data.accountsMove : [],
                countAccounts: response.data.countAccounts,
                dataFolder: response.data.folder,
                pathHash: response.data.pathHash,
                foldersMove: foldersMove.data
            },
        }
    } catch (e) {
        return {
            props: {
                error: '???????????? ?????? ?????????????????? ???????????? ??????????'
            },
        }
    }
}

export default Folder;