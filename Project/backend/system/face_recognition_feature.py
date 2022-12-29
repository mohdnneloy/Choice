# import face_recognition
from deepface import DeepFace
import cv2

# Function to recognize voter
def voterFaceRecognition(check_image, known_voter_image_directory):

    # Solution using Face Recognition Package
    # known_image = face_recognition.load_image_file(known_voter_image_directory)
    # unknown_image = face_recognition.load_image_file(check_image)
    #
    # try:
    #     known_encoding = face_recognition.face_encodings(known_image)[0]
    # except IndexError as e:
    #     return False
    #
    # try:
    #     unknown_encoding = face_recognition.face_encodings(unknown_image)[0]
    # except IndexError as e:
    #     return False
    #
    # is_match = face_recognition.compare_faces([known_encoding], unknown_encoding)
    #
    # print(is_match)

    # Solution using DeepFace Package
    img_known = cv2.imread(str(known_voter_image_directory))
    img_unknown = cv2.imread(str(check_image))

    try:
        is_match = DeepFace.verify(img_known, img_unknown)
    except Exception as e:
        print("No face found")
        return False

    if is_match["distance"] <= 0.79:
        print("True", is_match)
        return True

    print("False", is_match)
    return False
