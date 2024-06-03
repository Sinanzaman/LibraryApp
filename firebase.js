import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // Firestore için ekledik
import 'firebase/compat/storage'; // Storage için ekledik
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { deleteObject, listAll, ref } from 'firebase/storage';

const firebaseConfig = {
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore(); // Firestore nesnesini oluşturduk
const storage = firebase.storage();

const UploadProfilePicture = async (file, ImageName, callback) => {
  try {
    const user = auth.currentUser;

    const storageRef = storage.ref().child('users').child(user.uid).child(user.uid + ImageName)
    await storageRef.put(file); // put metoduyla dosyayı yüklüyoruz
    callback(true); // Yükleme başarılı
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    callback(false); // Yükleme başarısız
  }
};

const generateRandomFileName = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomName = '';
  for (let i = 0; i < 20; i++) {
    randomName += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomName ;
};

const saveProfilePicture = async (ImageName) => {
  try {
    // Kullanıcının oturum açmış olup olmadığını kontrol et
    const user = auth.currentUser;

    if (user) {
      const downloadURL = await firebase.storage().ref('users/' + user.uid + '/' + user.uid + ImageName).getDownloadURL();

      // Kullanıcı verilerini belgeye ekle
      await db.collection('users').doc(user.uid).set({
        user_profile_picture_url: downloadURL,
      },{ merge: true });
      console.log('Resim başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Resim kaydedilirken bir hata oluştu: ', error);
  }
}

const saveNameSurname = async (NameSurname) => {
  try {
    const user = auth.currentUser;
    const user_uid = user.uid;

    if (user.uid) {

      const user_name_surname = NameSurname;

      await db.collection('users').doc(user_uid).set({
        user_name_surname: user_name_surname,
      },{ merge: true });
      console.log('Kullanıcı Adı başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Kullanıcı Adı kaydedilirken bir hata oluştu: ', error);
  }
}

const UploadPdfAdmin = async (file, fileName, callback) => {
  try {
    const storageRef = storage.ref().child('books').child(fileName).child(fileName+'.pdf')
    await storageRef.put(file); // put metoduyla dosyayı yüklüyoruz
    callback(true); // Yükleme başarılı
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    callback(false); // Yükleme başarısız
  }
};

const UploadPdfUser = async (file, fileName, callback) => {
  try {
    const storageRef = storage.ref().child('books').child(fileName).child(fileName+'.pdf')
    await storageRef.put(file); 
    callback(true); // Yükleme başarılı
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    callback(false); // Yükleme başarısız
  }
};

const UploadPdfImageAdmin = async (file, fileName, callback) => {
  try {
    const storageRef = storage.ref().child('books').child(fileName).child(fileName+'.img')
    await storageRef.put(file); 
    callback(true); // Yükleme başarılı
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    callback(false); // Yükleme başarısız
  }
};

const UploadPdfImageUser = async (file, fileName, callback) => {
  try {
    const storageRef = storage.ref().child('books').child(fileName).child(fileName+'.img')

    await storageRef.put(file); 
    callback(true); // Yükleme başarılı
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    callback(false); // Yükleme başarısız
  }
};

const savePdfAdmin = async (randomFileName) => {
  try {
    const user = auth.currentUser;
    
    if (user) {
      const downloadURL = await firebase.storage().ref('books/' + randomFileName + '/' + randomFileName + '.pdf').getDownloadURL();

      // Kullanıcı verilerini belgeye ekle
      await db.collection('books').doc(randomFileName).set({
        pdf_url: downloadURL,
        book_id: randomFileName,      // kendimiz id atadık
      },{ merge: true });
      console.log('Dosya başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Veri kaydedilirken bir hata oluştu: ', error);
  }
}

const savePdfUser = async (randomFileName) => {
  try {
    // Kullanıcının oturum açmış olup olmadığını kontrol et
    const user = auth.currentUser;
    
    if (user) {
      const downloadURL = await firebase.storage().ref('books/'+ randomFileName + '/' + randomFileName + '.pdf').getDownloadURL();

      // Kullanıcı verilerini belgeye ekle
      await db.collection(`books`).doc(randomFileName).set({
        pdf_url: downloadURL,
        book_id: randomFileName,      // kendimiz id atadık
      },{ merge: true });
      console.log('Dosya başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Veri kaydedilirken bir hata oluştu: ', error);
  }
}

const savePdfImageAdmin = async (randomFileName) => {
  try {
    // Kullanıcının oturum açmış olup olmadığını kontrol et
    const user = auth.currentUser;
    
    if (user) {
      const downloadURL = await firebase.storage().ref('books/' + randomFileName + '/' + randomFileName + '.img').getDownloadURL();

      // Kullanıcı verilerini belgeye ekle
      await db.collection('books').doc(randomFileName).set({
        pdf_resim_url: downloadURL,
      },{ merge: true });
      console.log('Dosya başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Resim kaydedilirken bir hata oluştu: ', error);
  }
}

const savePdfImageUser = async (randomFileName) => {
  try {
    // Kullanıcının oturum açmış olup olmadığını kontrol et
    const user = auth.currentUser;
    
    if (user) {
      const downloadURL = await firebase.storage().ref('books/'+ randomFileName + '/' + randomFileName + '.img').getDownloadURL();

      // Kullanıcı verilerini belgeye ekle
      await db.collection(`books`).doc(randomFileName).set({
        pdf_resim_url: downloadURL,
      },{ merge: true });
      console.log('Dosya başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Resim kaydedilirken bir hata oluştu: ', error);
  }
}

const savePdfDescAdmin = async (Desc,randomFileName) => {
  try {
    const user = auth.currentUser;

    if (user) {
      const pdf_descc = Desc;

      await db.collection('books').doc(randomFileName).set({
        pdf_desc: pdf_descc,
      },{ merge: true });
      console.log('Açıklama başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Açıklama kaydedilirken bir hata oluştu: ', error);
  }
}

const savePdfDescUser = async (Desc,randomFileName) => {
  try {
    const user = auth.currentUser;

    if (user) {
      const pdf_descc = Desc;

      await db.collection(`books`).doc(randomFileName).set({
        pdf_desc: pdf_descc,
      },{ merge: true });
      console.log('Açıklama başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Açıklama kaydedilirken bir hata oluştu: ', error);
  }
}

const savePdfBookNameAdmin = async (bookName,randomFileName) => {
  try {
    const user = auth.currentUser;

    if (user) {
      const pdf_book_name = bookName;

      await db.collection('books').doc(randomFileName).set({
        pdf_book_name: pdf_book_name,
      },{ merge: true });
      console.log('Kitap Adı başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Kitap Adı kaydedilirken bir hata oluştu: ', error);
  }
}

const savePdfBookNameUser = async (bookName,randomFileName) => {
  try {
    const user = auth.currentUser;

    if (user) {
      const pdf_book_name = bookName;

      await db.collection(`books`).doc(randomFileName).set({
        pdf_book_name: pdf_book_name,
      },{ merge: true });
      console.log('Kitap Adı başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Kitap Adı kaydedilirken bir hata oluştu: ', error);
  }
}

const saveLastOpened = async (randomFileName) => {
  try {
    const user = auth.currentUser;
    const currentDate = new Date(2023,0);    // son okunanlar arasına karışmaması için geçmiş tarih girdik

    if (user) {

      await db.collection(`books`).doc(randomFileName).set({
        pdf_last_opened : currentDate,
      },{ merge: true });

    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Son Açılış kaydedilirken bir hata oluştu: ', error);
  }
}
const updateLastOpened = async (randomFileName) => {
  try {
    const user = auth.currentUser;
    const currentDate = new Date();    // dosya açılınca asıl tarih güncellenir

    if (user) {

      await db.collection(`users`).doc(user.uid).collection('users_books').doc(randomFileName).set({
        pdf_last_opened : currentDate,
      },{ merge: true });

    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Son Açılış kaydedilirken bir hata oluştu: ', error);
  }
}

const saveYayinEvi = async (yayinevi,randomFileName) => {
  try {
    const user = auth.currentUser;

    if (user) {
      const pdf_yayinevi = yayinevi;

      await db.collection(`books`).doc(randomFileName).set({
        pdf_yayinevi: pdf_yayinevi,
      },{ merge: true });
      console.log('Yayınevi başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Yayınevi kaydedilirken bir hata oluştu: ', error);
  }
}
const saveKategoriler = async (kategoriler,randomFileName) => {
  try {
    const user = auth.currentUser;

    if (user) {
      const pdf_kategoriler = kategoriler;

      await db.collection(`books`).doc(randomFileName).set({
        pdf_kategoriler: pdf_kategoriler,
      },{ merge: true });
      console.log('Kategoriler başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Kategoriler kaydedilirken bir hata oluştu: ', error);
  }
}
const saveYazar = async (yazar,randomFileName) => {
  try {
    const user = auth.currentUser;

    if (user) {
      const pdf_yazar = yazar;

      await db.collection(`books`).doc(randomFileName).set({
        pdf_yazar: pdf_yazar,
      },{ merge: true });
      console.log('Yazar başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Yazar kaydedilirken bir hata oluştu: ', error);
  }
}

const saveVisibility = async (booleanData,randomFileName) => {
  try {
    const user = auth.currentUser;

    if (user) {
      const boolean = booleanData;

      await db.collection(`books`).doc(randomFileName).set({
        pdf_visibility: boolean,
        pdf_owner: user.uid,
      },{ merge: true });
      console.log('Gizlilik başarıyla kaydedildi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Gizlilik kaydedilirken bir hata oluştu: ', error);
  }
}

const addBookToUser = async (randomFileName) => {
  try {
    const user = auth.currentUser;

    if (user) {
      await db.collection(`users`).doc(user.uid).collection('users_books').doc(randomFileName).set({
        book_id: randomFileName,
      },{ merge: true });
      console.log('Kitap başarıyla kullanıcıya eklendi.');
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Kitap kullanıcıya eklenirken bir hata oluştu: ', error);
  }
}

const saveLastReadBook = async (bookid) => {
  try {
    const user = auth.currentUser;

    if (user) {
      await db.collection(`users`).doc(user.uid).collection('users_books').doc('LastReadBook').set({
        bookid: bookid,
      },{ merge: true });
      /* console.log('Son okunan kitap başarıyla kullanıcıya eklendi.'); */
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Son okunan kitap kullanıcıya eklenirken bir hata oluştu: ', error);
  }
}

const saveLastPage = async (page) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await db.collection(`users`).doc(user.uid).collection('users_books').doc('LastReadBook').set({
        pdf_LastPage: page,
      },{ merge: true });
      /* console.log('Son sayfa başarıyla kullanıcıya eklendi.'); */
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Son sayfa eklenirken bir hata oluştu: ', error);
  }
}
const saveTotalPage = async (numberOfPages) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await db.collection(`users`).doc(user.uid).collection('users_books').doc('LastReadBook').set({
        pdf_numberOfPages: numberOfPages
      },{ merge: true });
      /* console.log('Toplam sayfa başarıyla kullanıcıya eklendi.'); */
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Toplam sayfa eklenirken bir hata oluştu: ', error);
  }
}

const saveBookLastPage = async (bookId, page) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userBooksRef = collection(db, `users/${user.uid}/users_books`);
      const bookDocRef = doc(userBooksRef, bookId);
      await setDoc(bookDocRef, {
        pdf_LastPage: page
      }, { merge: true });
      /* console.log('Son sayfa başarıyla kaydedildi.'); */
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Son sayfa kaydedilirken bir hata oluştu: ', error);
  }
};

const deleteFolderContents = async (storage, folderPath) => {
  try {
    const listRef = ref(storage, folderPath);
    const listResult = await listAll(listRef);

    // Klasör altındaki her dosyayı sil
    await Promise.all(listResult.items.map(async (item) => {
      await deleteObject(item);
      console.log(`${item.name} silindi.`);
    }));

    // Klasör altındaki alt klasörleri sil
    await Promise.all(listResult.prefixes.map(async (prefix) => {
      await deleteFolderContents(storage, prefix.fullPath);
    }));
  } catch (error) {
    console.error('Klasör içeriği silinirken bir hata oluştu: ', error);
  }
}

const handleEncryptMail = (email) => {
  const atIndex = email.indexOf('@');
  const firstPart = email.slice(0, 2); // E-postanın ilk iki karakteri
  const encryptedPart = '*'.repeat(atIndex - 2); // "*" ile doldurulacak kısmı oluştur
  const remainingPart = email.slice(atIndex); // "@" işaretinden sonraki kısmı al

  return firstPart + encryptedPart + remainingPart;
}

const saveUserComment = async (bookid, comment, anonymousComment) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const bookRef = db.collection('book_comments').doc(bookid);
      const now = new Date();
      const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const commentId = now.getTime().toString(); // Yorum kimliği
      
      const newComment = {
        commentId: commentId, // Yorum kimliğini ekle
        useremail: user.email,
        useremailanonymous: anonymousComment ? handleEncryptMail(user.email) : false,
        comment: comment,
        likes: {},
        dislikes: {},
        timestamp: formattedDate.toString(), // Yerel zaman damgası
        reporters: {}, // Raporlanan kullanıcılar listesi için boş bir nesne oluştur
      };

      try {
        // Yorum kimliğini belge alanı olarak ekleme/güncelleme
        await bookRef.set({
          [commentId]: newComment
        }, { merge: true });
      } catch (error) {
        console.error("Yorum kaydedilirken bir hata oluştu: ", error);
      }
      console.log("Yorum yüklemesi başarılı");
    } else {
      console.error('Yorum kaydedilemedi.');
    }
  } catch (error) {
    console.error('Yorum kaydedilirken bir hata oluştu: ', error);
  }
}

const deleteComment = async (bookid, commentId) => {
  try {
    const bookRef = db.collection('book_comments').doc(bookid);
    await bookRef.update({
      [commentId]: firebase.firestore.FieldValue.delete()
    });
    console.log("Yorum başarıyla silindi.");
  } catch (error) {
    console.error("Yorum silinirken bir hata oluştu: ", error);
  }
}

const addLikeToComment = async (bookId, commentId) => {
  try {
    const user = auth.currentUser;
    // Belirli bir yoruma erişmek için bookRef'i kullan
    const bookRef = db.collection('book_comments').doc(bookId);
    
    // Yorumu belgeden al
    const doc = await bookRef.get();

    // Belge varsa ve yorum mevcutsa işlem yap
    if (doc.exists) {
      const commentData = doc.data()[commentId];
      
      // Yorum var mı kontrol et
      if (commentData) {
        // Yorumun beğeni objesini al
        const currentLikes = commentData.likes || {};
        
        // Yorumu beğenmiş mi kontrol et
        if (currentLikes[user.uid]) {
          // Eğer kullanıcı zaten beğenmişse, beğeniyi kaldır
          delete currentLikes[user.uid];

          // Yorumu güncelle ve beğeniyi kaldır
          await bookRef.update({
            [`${commentId}.likes`]: currentLikes
          });

          console.log('Beğeni kaldırıldı');
        } else {
          // Kullanıcı daha önce beğenmemişse, beğeni ekle
          const updatedLikes = { ...currentLikes, [user.uid]: true };

          // Yorumu güncelle ve beğeniyi ekle
          await bookRef.update({
            [`${commentId}.likes`]: updatedLikes
          });

          console.log('Beğeni eklendi');
        }
      } else {
        console.error('Belirtilen yorum bulunamadı');
      }
    } else {
      console.error('Belirtilen kitap bulunamadı.');
    }
  } catch (error) {
    console.error('Beğeni eklenirken bir hata oluştu: ', error);
  }
};

const addDislikeToComment = async (bookId, commentId) => {
  try {
    const user = auth.currentUser;
    // Belirli bir yoruma erişmek için bookRef'i kullan
    const bookRef = db.collection('book_comments').doc(bookId);
    
    // Yorumu belgeden al
    const doc = await bookRef.get();

    // Belge varsa ve yorum mevcutsa işlem yap
    if (doc.exists) {
      const commentData = doc.data()[commentId];
      
      // Yorum var mı kontrol et
      if (commentData) {
        // Yorumun beğenmeme objesini al
        const currentDislikes = commentData.dislikes || {};
        
        // Yorumu beğenmiş mi kontrol et
        if (currentDislikes[user.uid]) {
          // Eğer kullanıcı zaten beğenmemişse, beğenmeme kaldır
          delete currentDislikes[user.uid];

          // Yorumu güncelle ve beğenmeyi kaldır
          await bookRef.update({
            [`${commentId}.dislikes`]: currentDislikes
          });

          console.log('Beğenmeme kaldırıldı');
        } else {
          // Kullanıcı daha önce beğenmemişse, beğenmeme ekle
          const updatedDislikes = { ...currentDislikes, [user.uid]: true };

          // Yorumu güncelle ve beğenmeyi ekle
          await bookRef.update({
            [`${commentId}.dislikes`]: updatedDislikes
          });

          console.log('Beğenmeme eklendi');
        }
      } else {
        console.error('Belirtilen yorum bulunamadı');
      }
    } else {
      console.error('Belirtilen kitap bulunamadı.');
    }
  } catch (error) {
    console.error('Beğenmeme eklenirken bir hata oluştu: ', error);
  }
};

const addReportToComment = async (bookId, commentId) => {
  try {
    const user = auth.currentUser;
    // Belirli bir yoruma erişmek için bookRef'i kullan
    const bookRef = db.collection('book_comments').doc(bookId);
    
    // Yorumu belgeden al
    const doc = await bookRef.get();

    // Belge varsa ve yorum mevcutsa işlem yap
    if (doc.exists) {
      const commentData = doc.data()[commentId];
      
      // Yorum var mı kontrol et
      if (commentData) {
        // Yorumun raporlayanlar objesini al
        const currentReporters = commentData.reporters || {};
        
        // Kullanıcı daha önce raporladı mı kontrol et
        if (currentReporters[user.uid]) {
          // Eğer kullanıcı zaten raporladıysa, raporlamayı kaldır
          delete currentReporters[user.uid];

          // Yorumu güncelle ve raporlamayı kaldır
          await bookRef.update({
            [`${commentId}.reporters`]: currentReporters
          });

          console.log('Raporlama kaldırıldı');
        } else {
          // Kullanıcı daha önce raporlamadıysa, raporlamayı ekle
          const updatedReporters = { ...currentReporters, [user.uid]: true };

          // Yorumu güncelle ve raporlamayı ekle
          await bookRef.update({
            [`${commentId}.reporters`]: updatedReporters
          });

          console.log('Raporlama eklendi');
        }
      } else {
        console.error('Belirtilen yorum bulunamadı');
      }
    } else {
      console.error('Belirtilen kitap bulunamadı.');
    }
  } catch (error) {
    console.error('Raporlama eklenirken bir hata oluştu: ', error);
  }
};

const saveSuggestionAndComplaint = async (text) => {
  try {
    const user = auth.currentUser;
    const feedbackRef = collection(db, 'feedback');
    await addDoc(feedbackRef, {
      text: text,
      userid : user.uid,
      timestamp: new Date(),
    });
    console.log('Feedback successfully written!');
  } catch (error) {
    console.error('Error writing feedback:', error);
    throw error;
  }
};



export { auth, db, storage, UploadProfilePicture, generateRandomFileName, saveNameSurname, saveProfilePicture };
export { UploadPdfAdmin, UploadPdfUser, UploadPdfImageAdmin, UploadPdfImageUser, saveLastReadBook, saveLastPage, saveTotalPage,
  deleteFolderContents, savePdfAdmin, savePdfUser, savePdfImageAdmin, savePdfImageUser, saveLastOpened, saveVisibility, addBookToUser,
  updateLastOpened, savePdfDescAdmin, savePdfBookNameAdmin, savePdfBookNameUser, savePdfDescUser, saveYayinEvi, saveKategoriler, saveYazar,
  saveUserComment, addLikeToComment, addDislikeToComment, addReportToComment, deleteComment, saveBookLastPage, saveSuggestionAndComplaint}
