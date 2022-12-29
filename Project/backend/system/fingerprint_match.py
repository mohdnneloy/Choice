import os
from aiohttp import Fingerprint
import cv2

def fingerpMatch(unknown_fingerprint, known_fingerprint):

    sample = cv2.imread(str(unknown_fingerprint))

    best_score = counter = 0
    filename = image = kp1 = kp2 = mp = None

    fingerprint_img = cv2.imread(str(known_fingerprint))

    sift = (
        cv2.SIFT_create()
    )
    # extract key points from image; keypoints are particularly interesting or stand out; descriptors describe keypoints

    keypoints_1, des1 = sift.detectAndCompute(sample, None)
    keypoints_2, des2 = sift.detectAndCompute(fingerprint_img, None)

    # fast library for KNN; approx best match
    matches = cv2.FlannBasedMatcher({"algorithm": 1, "trees": 10}, {}).knnMatch(des1, des2, k=2)


    match_points = []
    for p, q in matches:
        if p.distance < 0.29 * q.distance:
            match_points.append(p)


    keypoints = 0
    if len(keypoints_1) <= len(keypoints_2):
        keypoints = len(keypoints_1)
    else:
        keypoints = len(keypoints_2)

    if len(match_points) / keypoints * 100 > best_score:
        best_score = len(match_points) / keypoints * 100
        filename = str(known_fingerprint)
        image = fingerprint_img
        kp1, kp2, mp = keypoints_1, keypoints_2, match_points
        print("Fingerprint Matched")
        print("Best match:  " + str(filename))
        print("Best score:  " + str(best_score))
        return True

    print("Fingerprint do not Matched")
    print("Best match:  " + str(filename))
    print("Best score:  " + str(best_score))
    return False

    # Check Match through image window
    # if len(match_points) > 0:
    #     result = cv2.drawMatches(sample, kp1, image, kp2, mp, None)
    #     result = cv2.resize(result, (640, 320), fx=4, fy=4)
    #     cv2.imshow("Result", result)
    #     cv2.waitKey(0)
    #     cv2.destroyAllWindows()
    #     return (False)

# isIdentical("../test/voter_fingerprint/f3.bmp", "../test/voter_fingerprint/f2.bmp" )
