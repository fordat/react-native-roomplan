// RoomPlanCaptureModule.swift

import Foundation
import UIKit
import React

@objc(RoomPlanCaptureModule)
@available(iOS 17.0, *)
class RoomPlanCaptureModule: NSObject, RCTBridgeModule {
  
  private var captureViewController: RoomPlanCaptureViewController?

  @objc
  static func moduleName() -> String! {
    return "RoomPlanCaptureModule"
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func startCapture(_ scanName: String, apiToken: String, apiURL: String) {
    DispatchQueue.main.async {
      guard let rootVC = UIApplication.shared.keyWindow?.rootViewController else { return }
      let captureVC = RoomPlanCaptureViewController()
      captureVC.apiToken = apiToken
      captureVC.apiURL = apiURL
      captureVC.scanName = scanName
      captureVC.modalPresentationStyle = .fullScreen

      rootVC.present(captureVC, animated: true, completion: nil)
      self.captureViewController = captureVC
    }
  }

  @objc
  func stopCapture() {
    DispatchQueue.main.async {
      self.captureViewController?.stopSession()
      self.captureViewController?.dismiss(animated: true, completion: nil)
    }
  }
}