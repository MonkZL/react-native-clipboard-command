#import "ClipboardCommand.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNClipboardCommandSpec.h"
#endif

@implementation ClipboardCommand
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setCommand:(NSString *)command)
{
    //创建系统剪切板
    UIPasteboard *systemBoard = [UIPasteboard generalPasteboard];
    //将文本写入剪切板
    systemBoard.string = command;
    //给剪切板加入一条标记性的数据，只是为了检测剪切板的数据是否来自当前应用
    NSDictionary<NSString *, id> *item = @{[[NSBundle mainBundle]bundleIdentifier]:command};
    [systemBoard addItems:@[item]];
}

RCT_EXPORT_METHOD(getCommand:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
    @try {
        //创建系统剪切板
        UIPasteboard *systemBoard = [UIPasteboard generalPasteboard];
        if(!systemBoard.numberOfItems) {
            reject(@"0",@"没有数据", nil);
            return;
        }
        NSArray<NSDictionary<NSString *, id> *> *items = systemBoard.items;
        long count = items.count;
        for(int i=0; i < count; i++){
            NSDictionary<NSString *, id> *item = [items objectAtIndex:i];
            if([[item allKeys] containsObject:[[NSBundle mainBundle]bundleIdentifier]]){
                reject(@"1",@"自己在应用内复制的指令", nil);
                return;
            }
        }
        resolve((systemBoard.string ? : @""));
    } @catch (NSException *exception) {
        reject(@"2",exception.reason, nil);
    } @finally {
                
    }
}


// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeClipboardCommandSpecJSI>(params);
}
#endif

@end
