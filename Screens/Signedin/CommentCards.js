import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import { addDislikeToComment, addLikeToComment, addReportToComment, deleteComment } from '../../firebase';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function CommentCards({usermail, usercomment, date, likes, dislikes,
    reporters, bookid, commentId, handleGetComment, user, useremailanonymous, anonymous}) {

    const handlePressLike = async () => {
        await addLikeToComment(bookid, commentId);
        handleGetComment();
    };

    const handlePressDislike = async () => {
        await addDislikeToComment(bookid, commentId);
        handleGetComment();
    };

    const handlePressReport = async () => {
        await addReportToComment(bookid, commentId);
        handleGetComment();
    };

    const handlePressDelete = () => {
        Alert.alert(
            'Yorumu Sil',
            'Bu yorumu silmek istediğinize emin misiniz?',
            [
                { text: 'Vazgeç', style: 'cancel' },
                { text: 'Sil', onPress: async () => {
                    await deleteComment(bookid, commentId);
                    handleGetComment();
                }}
            ]
        );
    };
    

    return (
        <View style={styles.container}>
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection:'row'}}>
                    <Image style={styles.profilePicture} source={require('../../assets/Images/userphoto.jpg')} />
                    <View style={styles.rightContainer}>
                        <View style={{marginBottom:6}}>
                            <Text style={styles.userMail}>{useremailanonymous ? useremailanonymous : usermail}</Text>
                        </View>
                        <View style={{maxWidth:'90%',justifyContent: 'center'}}>
                            <Text>{usercomment}</Text>
                        </View>
                        <View style={{borderTopWidth:1, marginTop:5, borderColor:'grey'}}>
                            <Text>{date}</Text>
                        </View>
                    </View>
                </View>
                { user?.email === usermail && (
                    <TouchableOpacity onPress={handlePressDelete}>
                        <AntDesign name="delete" size={20} color="red" />
                    </TouchableOpacity>
                )}
            </View>
            {!anonymous && <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:40, marginTop:10}}>
                <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={handlePressLike} >
                    <AntDesign name="like1" size={15} style={{marginRight:3}}/>
                    <Text>{likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={handlePressDislike} >
                    <AntDesign name="dislike1" size={15} style={{marginRight:3}}/>
                    <Text>{dislikes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={handlePressReport} >
                    <MaterialIcons name="report" size={15} style={{marginRight:3}}/>
                    <Text>{reporters}</Text>
                </TouchableOpacity>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'flex-start',
        backgroundColor:'white',
        width:screenWidth*0.90,
        padding:6,
        marginBottom:10,
        borderRadius:15,
    },
    leftContainer:{
    },
    userMail:{
        fontWeight:'bold',
    },
    rightContainer:{
    },
    profilePicture: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#ddd', // Gri arka plan rengi
        marginRight: 20,
    },
})
