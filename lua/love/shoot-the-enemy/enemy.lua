local Enemy = Object:extend()

function Enemy:new()
	self.image = love.graphics.newImage("snake.png")
	self.speed = 100
	self.width = self.image:getWidth()
	self.height = self.image:getHeight()

	self.x = love.graphics.getWidth() / 2 - self.width / 2
	self.y = 450
end

function Enemy:update(dt)
	self.x = self.x + self.speed * dt

	local window_width = love.graphics.getWidth()

	-- If the x is too far to the left then..
	if self.x < 0 then
		--Set x to 0
		self.x = 0
		self.speed = -self.speed

		-- Else, if the right side is too far to the right then..
	elseif self.x + self.width > window_width then
		-- Set the right side to the window's width
		self.x = window_width - self.width
		self.speed = -self.speed
	end
end

function Enemy:draw()
	love.graphics.draw(self.image, self.x, self.y)
end

return Enemy
