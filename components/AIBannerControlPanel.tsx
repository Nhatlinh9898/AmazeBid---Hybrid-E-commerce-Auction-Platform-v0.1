import React, { useState, useEffect } from 'react';
import { AIBannerGenerator, generateBannerCommand, AIBannerConfig } from '../utils/aiBannerGenerator';
import { Wand2, RefreshCw, Download, Palette, Sparkles } from 'lucide-react';

interface AIBannerControlPanelProps {
  onBannerGenerated: (banner: { imageUrl: string; title: string; subtitle: string }) => void;
}

const AIBannerControlPanel: React.FC<AIBannerControlPanelProps> = ({ onBannerGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<AIBannerConfig['theme']>('autumn');
  const [selectedStyle, setSelectedStyle] = useState<AIBannerConfig['style']>('modern');
  const [customElements, setCustomElements] = useState<string[]>([]);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [newElement, setNewElement] = useState('');
  const [newColor, setNewColor] = useState('');
  const [previewPrompt, setPreviewPrompt] = useState('');

  const themes: AIBannerConfig['theme'][] = [
    'tet', 'autumn', 'spring', 'summer', 'winter', 
    'valentine', 'christmas', 'black-friday'
  ];

  const styles: AIBannerConfig['style'][] = [
    'traditional', 'modern', 'minimalist', 'vibrant'
  ];

  const themeConfig = {
    tet: {
      name: 'Tết Nguyên Đán',
      defaultElements: ['hoa mai', 'đèn lồng', 'bánh chưng'],
      defaultColors: ['đỏ', 'vàng', 'gold']
    },
    autumn: {
      name: 'Mùa Thu',
      defaultElements: ['lá vàng', 'lá đỏ', 'cây phong'],
      defaultColors: ['vàng', 'cam', 'nâu']
    },
    spring: {
      name: 'Mùa Xuân',
      defaultElements: ['hoa anh đào', 'hoa đào', 'cây xanh'],
      defaultColors: ['hồng', 'trắng', 'xanh lá']
    },
    summer: {
      name: 'Mùa Hè',
      defaultElements: ['biển', 'cát', 'nắng'],
      defaultColors: ['xanh dương', 'xanh lá', 'vàng']
    },
    winter: {
      name: 'Mùa Đông',
      defaultElements: ['tuyết', 'đông cây', 'lửa trại'],
      defaultColors: ['trắng', 'xanh nhạt', 'xám']
    },
    valentine: {
      name: 'Valentine',
      defaultElements: ['hoa hồng', 'trái tim', 'sô cô la'],
      defaultColors: ['đỏ', 'hồng', 'trắng']
    },
    christmas: {
      name: 'Giáng Sinh',
      defaultElements: ['cây thông', 'quà', 'đông tuyết'],
      defaultColors: ['đỏ', 'xanh lá', 'vàng']
    },
    'black-friday': {
      name: 'Black Friday',
      defaultElements: ['giảm giá', 'mua sắm', 'hàng đợi'],
      defaultColors: ['đen', 'vàng', 'đỏ']
    }
  };

  useEffect(() => {
    const config: AIBannerConfig = {
      theme: selectedTheme,
      style: selectedStyle,
      elements: customElements.length > 0 ? customElements : themeConfig[selectedTheme].defaultElements,
      colors: customColors.length > 0 ? customColors : themeConfig[selectedTheme].defaultColors
    };
    setPreviewPrompt(AIBannerGenerator.generatePrompt(config));
  }, [selectedTheme, selectedStyle, customElements, customColors]);

  const handleGenerateBanner = async () => {
    setIsGenerating(true);
    try {
      const config: AIBannerConfig = {
        theme: selectedTheme,
        style: selectedStyle,
        elements: customElements.length > 0 ? customElements : undefined,
        colors: customColors.length > 0 ? customColors : undefined
      };

      const banner = await generateBannerCommand(config.theme, config.style);
      onBannerGenerated(banner);
    } catch (error) {
      console.error('Failed to generate banner:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMultiple = () => {
    const banners = AIBannerGenerator.generateMultipleBanners();
    console.log('Generated AI banners:', banners);
  };

  const addCustomElement = () => {
    if (newElement.trim() && !customElements.includes(newElement.trim())) {
      setCustomElements([...customElements, newElement.trim()]);
      setNewElement('');
    }
  };

  const addCustomColor = () => {
    if (newColor.trim() && !customColors.includes(newColor.trim())) {
      setCustomColors([...customColors, newColor.trim()]);
      setNewColor('');
    }
  };

  const removeCustomElement = (element: string) => {
    setCustomElements(customElements.filter(el => el !== element));
  };

  const removeCustomColor = (color: string) => {
    setCustomColors(customColors.filter(c => c !== color));
  };

  const resetCustomizations = () => {
    setCustomElements([]);
    setCustomColors([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Wand2 className="text-purple-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">AI Banner Generator</h2>
        <Sparkles className="text-yellow-500" size={20} />
      </div>

      {/* Theme Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Chủ đề</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {themes.map(theme => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTheme === theme
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {themeConfig[theme].name}
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Phong cách</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {styles.map(style => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                selectedStyle === style
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {style === 'traditional' ? 'Truyền thống' :
               style === 'modern' ? 'Hiện đại' :
               style === 'minimalist' ? 'Tối giản' : 'Sống động'}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Elements */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Yếu tố tùy chỉnh (Optional)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newElement}
            onChange={(e) => setNewElement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomElement()}
            placeholder="Thêm yếu tố (ví dụ: hoa sen)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={addCustomElement}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Thêm
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {customElements.map(element => (
            <span
              key={element}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1"
            >
              {element}
              <button
                onClick={() => removeCustomElement(element)}
                className="ml-1 text-purple-500 hover:text-purple-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Màu sắc tùy chỉnh (Optional)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomColor()}
            placeholder="Thêm màu (ví dụ: tím pastel)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addCustomColor}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thêm
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {customColors.map(color => (
            <span
              key={color}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
            >
              {color}
              <button
                onClick={() => removeCustomColor(color)}
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Prompt Preview */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Palette className="inline mr-1" size={16} />
          AI Prompt Preview
        </label>
        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 max-h-24 overflow-y-auto">
          {previewPrompt}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleGenerateBanner}
          disabled={isGenerating}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="animate-spin" size={20} />
              Đang tạo banner...
            </>
          ) : (
            <>
              <Wand2 size={20} />
              Tạo Banner
            </>
          )}
        </button>

        <button
          onClick={handleGenerateMultiple}
          className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Tạo Nhiều
        </button>

        <button
          onClick={resetCustomizations}
          className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Hướng dẫn sử dụng:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Chọn chủ đề và phong cách bạn muốn</li>
          <li>• Thêm yếu tố và màu sắc tùy chỉnh để tạo banner độc đáo</li>
          <li>• Nhấn "Tạo Banner" để AI tạo hình ảnh</li>
          <li>• Banner sẽ được tự động thêm vào trang của bạn</li>
          <li>• Sử dụng "Tạo Nhiều" để tạo nhiều variation</li>
        </ul>
      </div>
    </div>
  );
};

export default AIBannerControlPanel;
